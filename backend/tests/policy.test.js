const request = require('supertest');
const app = require('../server'); 
const mongoose = require('mongoose');
const Policy = require('../models/Policy'); 

describe('Policy Routes', () => {
  beforeAll(async () => {
    // Connect to the test database
    const url = `mongodb://localhost:27017/cloudRiskDB`; 
    await mongoose.connect(url);
  });

  afterAll(async () => {
    // Clean up database and close connection
    await Policy.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /policies', () => {
    it('should generate a policy based on user concerns', async () => {
      const res = await request(app)
        .post('/policies')
        .send({
          companyName: 'Example Company',
          concerns: ['Data Breach', 'Unauthorized Access']
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('policy');
      expect(res.body.policy).toHaveProperty('companyName', 'Example Company');
    });

    it('should return validation error for missing fields', async () => {
      const res = await request(app)
        .post('/policies')
        .send({
          concerns: ['Data Breach']
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('errors');
    });
  });
});
