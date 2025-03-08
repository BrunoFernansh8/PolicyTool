const request = require('supertest');
const app = require('../server'); 
const mongoose = require('mongoose');
const Risk = require('../models/Risk'); 
const { analyzeRisk } = require('../utils/gpt');

// Define the test suite for the Risk API
describe('Risk Routes', () => {
  beforeAll(async () => {
    // Connect to the test database
    const url = process.env.MONGO_URI; 
    await mongoose.connect(url);
  });

  afterAll(async () => {
    await Risk.deleteMany({}); 
    await mongoose.connection.close(); // Close the connection
  });

  describe('POST /risks', () => {
    it('should create a new risk', async () => {
      const userId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .post('/risks')
        .set('Authorization', `Bearer mockTokenForUser:${userId}`) 
        .send({
          title: 'Unauthorized Access',
          riskDescription: 'Potential unauthorised access to sensitive data.',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('title', 'Unauthorised Access');
    });

    it('should return validation error for missing fields', async () => {
      const userId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .post('/risks')
        .set('Authorisation', `Bearer mockTokenForUser:${userId}`) 
        .send({
          // Missing required fields
          title: 'Incomplete Risk',
        });

      expect(res.statusCode).toEqual(500); 
      expect(res.body).toHaveProperty('message', 'Error adding risk.');
    });
  });

  describe('POST /risks/analyze', () => {
    it('should analyze a stored risk using AI', async () => {
      // Mock AI analysis
      analyzeRisk.mockResolvedValue({
        backgroundResearch: 'Research on the concern in real life on real life cases',
        likelihood: 'High',
        consequences: 'Severe financial and reputational damage.',
        mitigationStrategies: {
          userInformation: 'Encrypt sensitive data.',
          client: 'Ensure emails and reports are sent our promptly, and inform clients as soon as possible',
          system: 'Install intrusion detection systems.',
          infrastructure: 'Implement redundancy measures',
        },
      });
  
      // Create a sample risk in the database
      const risk = await Risk.create({
        title: 'Sensitive Data Breach',
        description: 'Unauthorized access to sensitive data could occur.',
        reportedBy: 'user123',
        organization: 'Test Organisation',
      });
  
      const res = await request(app)
        .post('/risks/analyze')
        .send({ id: risk._id });
  
      expect(res.statusCode).toEqual(200);
      expect(res.body.analyzedRisk).toHaveProperty('title', 'Sensitive Data Breach');
      expect(res.body.analyzedRisk).toHaveProperty('backgroundResearch', 'Research on real-life cases of similar risks.');
      expect(res.body.analyzedRisk).toHaveProperty('likelihood', 'High');
      expect(res.body.analyzedRisk).toHaveProperty('consequences', 'Severe financial and reputational damage.');
      expect(res.body.analyzedRisk.mitigationStrategies).toMatchObject({
        userInformation: 'High risk of data exposure.',
        client: 'Loss of client trust.',
        system: 'System disruptions.',
        infrastructure: 'Possible infrastructure downtime.',
      });
      // Validate database updates
      const updatedRisk = await Risk.findById(risk._id);
      expect(updatedRisk.backgroundResearch).toEqual('Research on real-life cases of similar risks.');
      expect(updatedRisk.likelihood).toEqual('High');
      expect(updatedRisk.consequences).toEqual('Severe financial and reputational damage.');
      expect(updatedRisk.mitigationStrategies).toEqual({
        userInformation: 'Encrypt sensitive data.',
        client: 'Notify clients promptly in case of issues.',
        system: 'Install intrusion detection systems.',
        infrastructure: 'Implement redundancy measures.',
      });
    });
  
    it('should return 400 if no title is provided', async () => {
      const res = await request(app).post('/risks/analyze').send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('Risk title is required for analysis.');
    });
  
    it('should return 404 if the risk is not found', async () => {
      const res = await request(app)
        .post('/risks/analyze')
        .send({ title: 'Nonexistent Risk' });
  
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
      });

      const res = await request(app).post('/risks/analyze').send({ id: risk._id });

      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toEqual('Error analyzing stored risk.');
    });
  });

  describe('GET /risks', () => {
    it('should fetch all risks created by the user', async () => {
        const userId = new mongoose.Types.ObjectId();
        await Risk.create({
            title: 'Sample Risk',
            organization: 'Test Organisation'
        });

        const res = await request(app)
            .get('/risks')
            .set('Authorization', `Bearer mockTokenForUser:${userId}`); 

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
        
        // Check only required fields
        expect(res.body[0]).toHaveProperty('title', 'Sample Risk');
        expect(res.body[0]).toHaveProperty('organization', 'Test Organisation');
        
        // Ensure _id, createdAt & updatedAt are NOT in response
        expect(res.body[0]).not.toHaveProperty('_id');
        expect(res.body[0]).not.toHaveProperty('createdAt');
        expect(res.body[0]).not.toHaveProperty('updatedAt');
    });
});


  
});
