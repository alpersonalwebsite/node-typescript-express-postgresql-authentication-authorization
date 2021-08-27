import request from 'superagent';
import app, { address } from '../../server';
import { globalUser } from './00initTestsSpec';

const baseURL = `http://${address}`;

app;

const globalOrder = {
  status: 'active'
};

describe('Testing /orders endpoints', () => {
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

  it('can create an order > POST /orders', async () => {
    const response = await request
      .post(`${baseURL}/orders`)
      .auth(jwt, { type: 'bearer' })
      .send(globalOrder);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      user_id: userWithCredentials.id,
      ...globalOrder,
      id: 1
    });
  });
});
