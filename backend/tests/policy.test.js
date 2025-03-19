jest.setTimeout(500000); // Increase timeout for long-running tests

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

describe('Policy Routes', () => {
  let risk1, risk2;

  beforeAll(async () => {
    const url = process.env.MONGO_URI;
    await mongoose.connect(url);

    // Create sample risks in the database
    risk1 = await Risk.create({
      title: 'Data Breach',
      description: 'Unauthorized access to sensitive client data.',
      reportedBy: 'Admin',
      organization: 'Test Organization',
      backgroundResearch: 'Data breaches are common in the industry...',
      likelihood: 'High',
      consequences: 'Severe financial and reputational damage.',
      mitigationStrategies: 'Encrypt sensitive data and implement access controls.',
    });

    risk2 = await Risk.create({
      title: 'Unauthorized Access',
      description: 'Employees accessing systems without proper credentials.',
      reportedBy: 'Admin',
      organization: 'Test Organization',
      backgroundResearch: 'Insider threats are increasing...',
      likelihood: 'Medium',
      consequences: 'Data leaks and operational disruptions.',
      mitigationStrategies: 'Implement multi-factor authentication.',
    });
  });

  afterAll(async () => {
    await Risk.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /policies', () => {
    it('should generate a policy based on selected risk IDs', async () => {
      const res = await request(app)
        .post('/api/policy/policies')
        .send({
          organization: 'Example Company',
          riskIds: [risk1._id, risk2._id],
        });

      expect(res.statusCode).toEqual(200);
      expect(res.headers['content-type']).toContain('application/pdf');
    });

    it('should return validation error for missing fields', async () => {
      const res = await request(app)
        .post('/api/policy/policies')
        .send({
          organization: 'Example Company', // Missing riskIds
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Organisation and risk IDs are required.');
    });

    it('should return 404 if no valid risks are found for given IDs', async () => {
      const res = await request(app)
        .post('/api/policy/policies')
        .send({
          organization: 'Example Company',
          riskIds: ['64f10c2a4f17e255ad9b51c2'], // Invalid, non-existent ID
        });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'No risks found for the provided IDs.');
    });

    it('should handle server errors gracefully', async () => {
      jest.spyOn(Risk, 'find').mockImplementation(() => {
        throw new Error('Database error');
      });

      const res = await request(app)
        .post('/api/policy/policies')
        .send({
          organization: 'Example Company',
          riskIds: [risk1._id],
        });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('message', 'Error generating policy.');

      Risk.find.mockRestore();
    });
  });
});
