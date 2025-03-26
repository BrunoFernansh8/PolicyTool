jest.mock('../middlewares/authenticateMiddleware', () => {
  return (req, res, next) => {
    req.user = { id: 'testUserId' };
    next();
  };
});

const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Risk = require('../models/Risk');
const { analyzeRisk } = require('../utils/gpt');

// Mock the AI analysis function to return mitigationStrategies as a string
jest.mock('../utils/gpt', () => ({
  analyzeRisk: jest.fn(),
}));

const testUserId = 'testUserId';
const isTestEnvironment = process.env.NODE_ENV === 'test';

describe('Risk Routes', () => {
  beforeAll(async () => {
    const url = process.env.MONGO_URI;
    await mongoose.connect(url);
  });

  afterAll(async () => {
    // Remove the Risk.deleteMany() call completely
    await mongoose.connection.close();
  });

  describe('POST /api/risks', () => {
    it('should create a new risk', async () => {
      const res = await request(app)
        .post('/api/risks')
        .set('Authorization', `Bearer mockTokenForUser:${testUserId}`)
        .send({
          title: 'Unauthorized Access',
          description: 'A hacker gained access',
          reportedBy: testUserId,
          organization: 'Test Organisation'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('title', 'Unauthorized Access');
    });

    it('should return validation error for missing fields', async () => {
      const res = await request(app)
        .post('/api/risks')
        .set('Authorization', `Bearer mockTokenForUser:${testUserId}`)
        .send({
          // Missing description, reportedBy, and organization
          title: 'Incomplete Risk'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty(
        'message',
        'Title, description, reportedBy and organisation name are required.'
      );
    });
  });

  describe('POST /api/risks/analyze', () => {
    it('should analyze a stored risk using AI and update the risk', async () => {
      // Create a risk with empty analysis fields so that updates are allowed
      const risk = await Risk.create({
        title: 'Sensitive Data Breach',
        description: 'Unauthorized access to sensitive data could occur.',
        reportedBy: 'user123',
        organization: 'Test Organisation',
        backgroundResearch: "",
        likelihood: "",
        consequences: "",
        mitigationStrategies: ""
      });

      // Mock the analyzeRisk function to return a string for mitigationStrategies
      analyzeRisk.mockResolvedValue({
        backgroundResearch: 'Research on real-life cases of similar risks.',
        likelihood: 'High',
        consequences: 'Severe financial and reputational damage.',
        mitigationStrategies:
          'Encrypt sensitive data. Notify clients promptly in case of issues. Install intrusion detection systems. Implement redundancy measures.'
      });

      const res = await request(app)
        .post('/api/risks/analyze')
        .set('Authorization', `Bearer mockTokenForUser:${testUserId}`)
        .send({ id: risk._id });

      expect(res.statusCode).toEqual(200);
      expect(res.body.analyzedRisk).toHaveProperty('title', 'Sensitive Data Breach');
      expect(res.body.analyzedRisk).toHaveProperty('backgroundResearch', 'Research on real-life cases of similar risks.');
      expect(res.body.analyzedRisk).toHaveProperty('likelihood', 'High');
      expect(res.body.analyzedRisk).toHaveProperty('consequences', 'Severe financial and reputational damage.');
      expect(res.body.analyzedRisk).toHaveProperty(
        'mitigationStrategies',
        'Encrypt sensitive data. Notify clients promptly in case of issues. Install intrusion detection systems. Implement redundancy measures.'
      );
    });

    it('should return 400 if no risk ID is provided', async () => {
      const res = await request(app)
        .post('/api/risks/analyze')
        .set('Authorization', `Bearer mockTokenForUser:${testUserId}`)
        .send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('Risk ID is required for analysis.');
    });

    it('should return 404 if the risk is not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .post('/api/risks/analyze')
        .set('Authorization', `Bearer mockTokenForUser:${testUserId}`)
        .send({ id: nonExistentId });
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Risk not found.');
    });

    it('should handle server errors gracefully', async () => {
      analyzeRisk.mockRejectedValue(new Error('AI Analysis Error'));

      const risk = await Risk.create({
        title: 'System Vulnerability',
        description: 'System may be vulnerable to attack.',
        reportedBy: 'admin',
        organization: 'Sample Org',
        backgroundResearch: "",
        likelihood: "",
        consequences: "",
        mitigationStrategies: ""
      });

      const res = await request(app)
        .post('/api/risks/analyze')
        .set('Authorization', `Bearer mockTokenForUser:${testUserId}`)
        .send({ id: risk._id });
      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toEqual('Error analysing stored risk.');
    });
  });

  describe('GET /api/risk', () => {
    let risk1, risk2;
    
    beforeEach(async () => {
      risk1 = await Risk.create({
        title: 'Unique Risk',
        organization: 'Test Organisation',
        reportedBy: testUserId,
        description: 'Test risk description 1',
        
      });
      risk2 = await Risk.create({
        title: 'Another Risk',
        organization: 'Test Organisation',
        reportedBy: testUserId,
        description: 'Test risk description 2'
      });
    });
  
    // Remove the afterEach block completely to prevent deletion
    // afterEach(async () => {
    //   if (isTestEnvironment){
    //     await Risk.deleteMany({});
    //   }
    // });
  
    it('should fetch a single risk by title', async () => {
      const res = await request(app)
        .get('/api/getrisk')
        .query({ title: 'Unique Risk' })
        .set('Authorization', `Bearer mockTokenForUser:${testUserId}`);
  
      expect(res.statusCode).toEqual(200);
      // When searching by title, we expect a single risk object (not an array)
      expect(typeof res.body).toBe('object');
      expect(res.body.title).toEqual('Unique Risk');
      expect(res.body.organization).toEqual('Test Organisation');
      expect(res.body).toHaveProperty('_id');
      expect(res.body).not.toHaveProperty('createdAt');
      expect(res.body).not.toHaveProperty('updatedAt');
    });
  
    it('should fetch a single risk by riskId', async () => {
      const res = await request(app)
        .get('/api/getrisk')
        .query({ riskId: risk1._id.toString() })
        .set('Authorization', `Bearer mockTokenForUser:${testUserId}`);
  
      expect(res.statusCode).toEqual(200);
      expect(typeof res.body).toBe('object');
      expect(res.body.title).toEqual('Unique Risk');
      expect(res.body.organization).toEqual('Test Organisation');
      expect(res.body).toHaveProperty('_id');
      expect(res.body).not.toHaveProperty('createdAt');
      expect(res.body).not.toHaveProperty('updatedAt');
    });
  
    it('should fetch all risks by organisation', async () => {
      const res = await request(app)
        .get('/api/getrisk')
        .query({ organization: 'Test Organisation' })
        .set('Authorization', `Bearer mockTokenForUser:${testUserId}`);
  
        expect(res.statusCode).toEqual(200);
        // When searching by organization, we expect an array of risks
        expect(Array.isArray(res.body)).toBe(true);
        // At least two risks should be returned
        expect(res.body.length).toBeGreaterThanOrEqual(1);
        const riskTitles = res.body.map(risk => risk.title);
        expect(riskTitles).toEqual(expect.arrayContaining(['Unique Risk', 'Another Risk']));
        // Each risk should not include the excluded fields
        res.body.forEach(risk => {
          expect(risk).toHaveProperty('_id');
          expect(risk).not.toHaveProperty('createdAt');
          expect(risk).not.toHaveProperty('updatedAt');
        });
      });
    });
});