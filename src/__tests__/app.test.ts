import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import {
  connectMemoryServer,
  cleanUpMemoryServer,
} from '../database/memoryServer';



beforeAll(async () => {
  await connectMemoryServer();
});

afterAll(async () => {
  await cleanUpMemoryServer();
});

let token: string;

// test authentication(signup and login)
describe('user authentication', () => {
  it('it should create an account for a user', async () => {
    const data = {
      email: 'adele@gmail.com',
      password: 'adelepassword',
      fullname: 'Adele Ilenz',
    };

    const response = await request(app).post('/api/v1/users/signup').send(data);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('success');
    expect(response.body.data.email).toBe(data.email);
    expect(response.body.data.fullname).toBe(data.fullname);
    expect(response.body).toHaveProperty('token');
  });

  //   test login

  it('it should log the user into the application', async () => {
    const data = {
      email: 'adele@gmail.com',
      password: 'adelepassword',
    };

    const response = await request(app).post('/api/v1/users/login').send(data);

    token = response.body.token;

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.email).toBe(data.email);
    expect(response.body).toHaveProperty('token');
  });
});
