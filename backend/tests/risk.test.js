const request = require('supertest');
const app = require('../server'); // Import your Express app
const mongoose = require('mongoose');
const Risk = require('../models/Risk'); // Import the Risk model
const { response } = require('express');
const { analyzeRisk } = require('../utils/gpt');

// Define the test suite for the Risk API
describe('Risk Routes', () => {
  beforeAll(async () => {
    // Connect to the test database
    const url = `mongodb://localhost:27017/cloudRiskDB`; 
    await mongoose.connect(url);
  });

  afterAll(async () => {
    await Risk.deleteMany({}); // Clean up the database
    await mongoose.connection.close(); // Close the connection
  });

  describe('GET /risks', () => {
    it('should fetch all risks created by the user', async () => {
      const userId = new mongoose.Types.ObjectId();
      await Risk.create({
        title: 'Sample Risk',
        description: 'This is a test risk.',
        createdBy: userId,
      });

      const res = await request(app)
        .get('/risks')
        .set('Authorization', `Bearer mockTokenForUser:${userId}`); // Simulate authentication

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('title', 'Sample Risk');
    });
  });

  describe('POST /risks', () => {
    it('should create a new risk', async () => {
      const userId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .post('/risks')
        .set('Authorization', `Bearer mockTokenForUser:${userId}`) 
        .send({
          title: 'Unauthorized Access',
          description: 'Potential unauthorised access to sensitive data.',
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

      expect(res.statusCode).toEqual(500); // Based on your controller, missing fields will throw a 500
      expect(res.body).toHaveProperty('message', 'Error adding risk.');
    });
  });

  describe('POST /risk/analyze', () => {
    it('should analyze a concern using GPT', async () => {
      analyzeRisk.mockResolvedValue({
        likelihood: 'High',
        consequence: 'Severe financial and reputational damage.',
        recommendation: 'Implement strict access controls and employee training.',
      });
  
      const response = await request(app)
        .post('/risk/analyze')
        .send({
          concern: 'What happens if sensitive data is exposed?',
        });

        expect(response.statusCode).toBe(200);
        expect(response.body.analyzedConcern).toEqual({
          likelihood: 'High',
          consequence: 'Severe financial and reputational damage.',
          recommendation: 'Implement strict access controls and employee training.',
        });
    
        // Ensure the mocked analyzeRisk function was called
        expect(analyzeRisk).toHaveBeenCalledWith(
          'What happens if sensitive data is exposed to unauthorized personnel?'
        );
      });

    it('should return 400 if concern is missing', async () => {
      const res = await request(app)
        .post('/risks/analyze')
        .send({}); // Empty body

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('message', 'Concern description is required.');
    });
    it('should handle server errors gracefully', async () => {
      // Mock the analyzeRisk function to throw an error
      analyzeRisk.mockRejectedValue(new Error('GPT API error'));
  
      const response = await request(app)
        .post('/risks/analyze')
        .send({
          concern: 'What happens if sensitive data is exposed to unauthorized personnel?',
        });
  
      expect(response.statusCode).toBe(500);
      expect(response.body.message).toBe('Error analyzing concern.');
    });
    
  });
});
