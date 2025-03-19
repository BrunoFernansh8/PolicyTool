// tests/risk.test.js

// Mock the authentication middleware so that it always attaches a dummy user
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

describe('Risk Routes', () => {
  beforeAll(async () => {
    const url = process.env.MONGO_URI;
    await mongoose.connect(url);
  });

  afterAll(async () => {
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

  describe('GET /api', () => {
    it('should fetch all risks created by the user', async () => {
      await Risk.create({
        title: 'Sample Risk',
        organization: 'Test Organisation',
        reportedBy: testUserId,
        description: 'Test risk description'
      });

      const res = await request(app)
        .get('/api')
        .set('Authorization', `Bearer mockTokenForUser:${testUserId}`);

      expect(res.statusCode).toEqual(200);
      const risks = Array.isArray(res.body) ? res.body : res.body.risks;
      expect(Array.isArray(risks)).toBe(true);
      expect(risks.length).toBeGreaterThan(0);
      const sampleRisk = risks.find(r => r.title === 'Sample Risk');
      expect(sampleRisk).toBeDefined();
      expect(sampleRisk).toHaveProperty('organization', 'Test Organisation');
      expect(sampleRisk).not.toHaveProperty('_id');
      expect(sampleRisk).not.toHaveProperty('createdAt');
      expect(sampleRisk).not.toHaveProperty('updatedAt');
    });
  });
});
