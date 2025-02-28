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

  describe('POST /register/superuser', () => {
    it('should register a new superuser', async () => {
      const res = await request(app)
        .post('/register/superuser')
        .send({
          name: 'SuperUser Name',
          email: 'superuser@example.com',
          password: 'securepassword',
          companyName: 'Example Company'
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('superuser');
      expect(res.body.superuser).toHaveProperty('email', 'superuser@example.com');
    });

    it('should return validation error for missing fields', async () => {
      const res = await request(app)
        .post('/register/superuser')
        .send({
          email: 'superuser@example.com',
          password: 'securepassword'
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('errors');
    });
  });

  describe('POST /register/user', () => {
    it('should register a new user', async () => {
      // First, create a superuser to associate with
      const superuser = await request(app)
        .post('/register/superuser')
        .send({
          name: 'SuperUser Name',
          email: 'superuser2@example.com',
          password: 'securepassword',
          companyName: 'Example Company'
        });

      const res = await request(app)
        .post('/register/user')
        .send({
          name: 'Employee Name',
          email: 'employee@example.com',
          password: 'securepassword',
          postcode: '12345',
          companyName: 'Example Company' // Ensure this matches the superuser's company
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('email', 'employee@example.com');
    });

    it('should return validation error for missing fields', async () => {
      const res = await request(app)
        .post('/register/user')
        .send({
          email: 'employee@example.com',
          password: 'securepassword'
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('errors');
    });
  });
});
