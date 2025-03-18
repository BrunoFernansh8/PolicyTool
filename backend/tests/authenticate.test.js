const request = require('supertest');
const app = require('../server'); 
const mongoose = require('mongoose');
const User = require('../models/User'); 

describe('Authentication Routes', () => {
  beforeAll(async () => {
    // Connect to the test database
    const url = process.env.MONGO_URI; 
    await mongoose.connect(url);
  });

  afterAll(async () => {
    // Clean up database and close connection
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/auth/register/superuser', () => {
    it('should register a new superuser', async () => {
      const res = await request(app)
        .post('/api/auth/register/superuser')
        .send({
          name: 'SuperUserName', 
          email: 'superuser@example.com',
          password: 'securepassword',
          company: { name: 'ExampleCompany' } 
        });
      // Expected response: a success message and an organisationPassword property
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message', 'SuperUser registered successfully');
      expect(res.body).toHaveProperty('organisationPassword');
      expect(typeof res.body.organisationPassword).toBe('string');
      expect(res.body.organisationPassword.length).toBeGreaterThan(0);
    });

    it('should return validation error for missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/register/superuser')
        .send({
          email: 'superuser@example.com',
          password: 'securepassword'
          
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('errors');
    });
  });

  describe('POST /api/auth/register/user', () => {
    it('should register a new user', async () => {
      const superuserRes = await request(app)
        .post('/api/auth/register/superuser')
        .send({
          name: 'SuperUserName', 
          email: 'superuser2@example.com',
          password: 'securepassword',
          company: { name: 'ExampleCompany' } 
        });
      expect(superuserRes.statusCode).toEqual(201);
      const organisationPassword = superuserRes.body.organisationPassword;
      
      const res = await request(app)
        .post('/api/auth/register/user')
        .send({
          name: 'EmployeeName', 
          email: 'employee@example.com',
          password: 'securepassword',
          postcode: '12345',
          organisationPassword: organisationPassword
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('email', 'employee@example.com');
    });

    it('should return validation error for missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/register/user')
        .send({
          email: 'employee@example.com',
          password: 'securepassword'
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('errors');
    });
  });
});
