import request from 'superagent';
import app, { address } from '../../server';

const baseURL = `http://${address}`;

app;

export const globalUser = {
  firstname: 'Peter',
  lastname: 'Parker',
  password: '12345'
};

export const globalProduct = {
  name: 'Product 1',
  price: 11,
  category: 'Category 1'
};

describe('Create test data for testing Handlers', () => {
  let jwt: string;

  describe('Create a user for /users handlers and /orders', () => {
    it('creates a user', async () => {
      const responseCreate = await request
        .post(`${baseURL}/users`)
        .send(globalUser);
      expect(responseCreate.status).toBe(200);
      expect(responseCreate.body).toBeInstanceOf(String);

      jwt = responseCreate.body;
    });
  });

  describe('Create a product for /oders handlers', () => {
    it('creates a product', async () => {
      const responseCreate = await request
        .post(`${baseURL}/products`)
        .auth(jwt, { type: 'bearer' })
        .send(globalProduct);
      expect(responseCreate.status).toBe(200);
      expect(responseCreate.body).toEqual({
        id: 1,
        ...globalProduct
      });
    });
  });
});
