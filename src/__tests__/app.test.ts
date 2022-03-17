/**
 * summary - This is the test file. This file holds all the test coverage
 */

import request from 'supertest';
import app from '../app';
import {
  connectMemoryServer,
  cleanUpMemoryServer,
} from '../database/memoryServer';

// connect to Mongo Memory server before running tests
beforeAll(async () => {
  await connectMemoryServer();
});

// clean up Memory Server after running all tests
afterAll(async () => {
  await cleanUpMemoryServer();
});

let token: string;
let requestId: string;
let userId: string;

// test authentication(signup and login)
describe('user authentication', () => {
  it('it should create an account for a user', async () => {
    const data = {
      email: 'adele@gmail.com',
      password: 'adelepassword',
      fullname: 'Adele Ilenz',
    };

    const response = await request(app).post('/api/v1/users/signup').send(data);

    // const token = response.body.data.token

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
describe('create request', () => {
  it('it should create a support request for logged in users', async () => {
    const supportRequest = {
      title: 'Travel Ticket',
      description: 'No date on ticket',
    };
    const response = await request(app)
      .post('/api/v1/support')
      .send(supportRequest)
      .set('Authorization', `Bearer ${token}`);

    requestId = response.body.data.newSupportRequest._id;

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('newSupportRequest');
    expect(response.body.data.newSupportRequest).toHaveProperty(
      'customerCanComment'
    );
    expect(response.body.data.newSupportRequest.customerCanComment).toBeFalsy();
  });
});

// test get all previous requests created  by a customer
describe('get all previous requests', () => {
  it('it should get all previous support request created by a user', async () => {
    const response = await request(app)
      .get('/api/v1/support/requests')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('request');
    expect(Array.isArray(response.body.data.request)).toBe(true);

    expect(
      response.body.data.request[0].status === 'resolved' ||
        response.body.data.request[0].status === 'pending'
    ).toBeTruthy();
  });
});

// test get one previous request by a customer
describe('get one request', () => {
  it('it should get one request created by a customer', async () => {
    const response = await request(app)
      .get(`/api/v1/support/requests/${requestId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('request');
    expect(Array.isArray(response.body.data.request)).toBe(false);
  });
});

// update request by a customer
describe('update one request', () => {
  it('it should update one request created by a customer', async () => {
    const data = {
      description: 'Incorrect date on ticket',
    };
    const response = await request(app)
      .put(`/api/v1/support/requests/${requestId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(201);
    expect(response.body.data.updateRequest).toHaveProperty('title');
    expect(
      response.body.data.updateRequest.customerCanComment === true ||
        response.body.data.updateRequest.customerCanComment === false
    ).toBeTruthy;
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('updateRequest');
    expect(Array.isArray(response.body.data.updateRequest)).toBe(false);
  });
});

// update request status by a support agent
describe('update a request status', () => {
  it('it should update the status of a request', async () => {
    const data = {
      status: 'resolved',
    };
    const registerSupport = {
      email: 'supportRequest@gmail.com',
      password: 'supportpassword',
      fullname: 'user support',
      user: 'support',
    };

    const authResponse = await request(app)
      .post('/api/v1/users/signup')
      .send(registerSupport);
    let supportStaffToken = authResponse.body.token;

    const response = await request(app)
      .put(`/api/v1/support/requests/status/${requestId}`)
      .set('Authorization', `Bearer ${supportStaffToken}`)
      .send(data);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('requestStatus');
    expect(response.body.data.requestStatus).toHaveProperty('title');
    expect(response.body.data.requestStatus).toHaveProperty('status');
    expect(
      response.body.data.requestStatus.status === 'resolved' ||
        response.body.data.requestStatus.status === 'pending'
    ).toBeTruthy();
    expect(Array.isArray(response.body.data.requestStatus)).toBeFalsy();
  });
});

// test get all requests that has been resolved by the support agent
describe('get all resolved requests', () => {
  it('it should get all requests that has been resolved by the support agent', async () => {
    const response = await request(app)
      .get('/api/v1/support/get-resolved-requests')
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'resolved',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('link');
    expect(Array.isArray(response.body.data)).toBeFalsy();
  });
});

// test support create comment

describe('create a comment status', () => {
  it('it should create support agent comment on a request', async () => {
    const data = {
      content: 'request has been attended to',
      user: 'support',
    };
    // we need to verify the user commenting is the support agent, these are the data he needs to register
    const registerSupport = {
      email: 'supportagent@gmail.com',
      password: 'supportpassword',
      fullname: 'support agent',
      user: 'support',
    };

    // support agent signs up
    const authResponse = await request(app)
      .post('/api/v1/users/signup')
      .send(registerSupport);
    let supportStaffToken = authResponse.body.token;
    // post support agent's comment and send data back to the customer
    const response = await request(app)
      .post(`/api/v1/support/requests/comments/${requestId}`)
      .set('Authorization', `Bearer ${supportStaffToken}`)
      .send(data);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('requestId');
    expect(response.body.data).toHaveProperty('comment');
  });
});

// test customer create comment
describe('create comment', () => {
  it('it should create a customer comment on a request', async () => {
    const data = {
      content: 'request has been attended to',
      user: 'support',
    };
    const response = await request(app)
      .post(`/api/v1/support/requests/comments/${requestId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(data);

    // requestId = response.body.data.newSupportRequest._id;
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('comment');
    expect(response.body.data.comment).toHaveProperty('content');
  });
});

// test delete resolved request
describe('delete resolved request', () => {
  it('it should delete a request that resolved', async () => {
    //only an admin can delete request, admin signup
    const registerAdmin = {
      email: 'adminsupport@gmail.com',
      password: 'adminpassword',
      fullname: 'Admin Support',
      user: 'admin',
    };

    const authResponse = await request(app)
      .post('/api/v1/users/signup')
      .send(registerAdmin);

    console.log(authResponse, ">>>>>>>>")
    let adminToken = authResponse.body.token;
    let requestId = authResponse.body.data._id
    const response = await request(app)
      .delete(`/api/v1/support/${requestId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(response.status).toBe(204);
  });
});

// test delete user
describe('delete user', () => {
  it('it should delete a user', async () => {
    //only an admin can delete a user, admin signup
    const registerAdmin = {
      email: 'adminsupport2@gmail.com',
      password: 'adminpassword',
      fullname: 'Admin Support',
      user: 'admin',
    };
    const authResponse = await request(app)
    .post('/api/v1/users/signup')
    .send(registerAdmin);
    let adminToken = authResponse.body.token;
    let userId = authResponse.body.data._id;

    console.log(authResponse.body)

    const response = await request(app)
      .delete(`/api/v1/users/delete/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);

      // console.log(response)

      expect(response.status).toBe(204);
    console.log(response.status, '>>>>>>');
  });
});