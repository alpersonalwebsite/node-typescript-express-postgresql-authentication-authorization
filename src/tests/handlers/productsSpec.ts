import request from 'superagent';
import app, { address } from '../../server';
import { globalUser, globalProduct } from './00initTestsSpec';

const baseURL = `http://${address}`;

app;

describe('Testing /products endpoints', () => {
  let jwt: string;
  const userWithCredentials = {
    id: 1,
    password: globalUser.password
  };

  beforeAll(async () => {
    const responseAuthenticate = await request
      .post(`${baseURL}/users/authenticate`)
      .send(userWithCredentials);
    jwt = responseAuthenticate.body;
  });

  it('can get a list of products > GET /products', async () => {
    const response = await request.get(`${baseURL}/products`);
    expect(response.status).toBe(200);
  });

  it('can create a product > POST /products', async () => {
    const response = await request
      .post(`${baseURL}/products`)
      .send(globalProduct)
      .auth(jwt, { type: 'bearer' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 2, ...globalProduct });
  });

  it('can get a product > GET /products/:id', async () => {
    const response = await request.get(`${baseURL}/products/2`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 2, ...globalProduct });
  });
});
