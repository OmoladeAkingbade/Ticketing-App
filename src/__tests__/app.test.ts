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
let requestId: string;

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


// test create a support request
describe("create request", () => {
  it("it should create a support request for logged in users", async () => {
    const supportRequest = {
      title: "Travel Ticket",
      description: "No date on ticket",
    };

    const response = await request(app)
      .post("/api/v1/support")
      .send(supportRequest)
      .set("Authorization", `Bearer ${token}`);

    // console.log(response.body);

    requestId = response.body.data.newSupportRequest._id;

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("newSupportRequest");
    expect(response.body.data.newSupportRequest).toHaveProperty('customerCanComment');
    expect(response.body.data.newSupportRequest.customerCanComment).toBeFalsy();
  });
});

// test get all previous requests created  by a customer

describe("get all previous requests", () => {
  it("it should get all previous support request created by a user", async () => {
    const response = await request(app)
      .get("/api/v1/support/requests")
      .set("Authorization", `Bearer ${token}`);
      
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("request");
    expect(Array.isArray(response.body.data.request)).toBe(true);
  });
});

