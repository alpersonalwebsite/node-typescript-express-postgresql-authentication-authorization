import request from 'superagent';
import app, { address } from '../../server';
import { checkIfObjHasAllTheProperties } from '../../utils/validations';
import { globalUser } from './00initTestsSpec';

const baseURL = `http://${address}`;

app;

describe('Testing /users endpoints', () => {
  let jwt: string;

  it('can login as a user > POST /users', async () => {
    const response = await request.post(`${baseURL}/users/authenticate`).send({
      id: 1,
      password: globalUser.password
    });

    jwt = response.body;

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(String);
  });

  it('can get a list of users > GET /users', async () => {
    const response = await request
      .get(`${baseURL}/users`)
      .auth(jwt, { type: 'bearer' });
    expect(response.body).toEqual([
      {
        firstname: globalUser.firstname,
        lastname: globalUser.lastname
      }
    ]);
  });

  it('can create a user > POST /users', async () => {
    const response = await request.post(`${baseURL}/users`).send({
      firstname: 'Peter',
      lastname: 'Parker',
      password: '12345'
    });
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(String);
  });

  it('can get a user (full version when user is the own user) > GET /users/:id', async () => {
    const response = await request
      .get(`${baseURL}/users/1`)
      .auth(jwt, { type: 'bearer' });
    expect(
      checkIfObjHasAllTheProperties(response.body, [
        'id',
        'firstname',
        'lastname',
        'password_digest'
      ])
    ).toBeTruthy();
  });

  it('can get a user (MIN version when user is different than requester) > GET /users/:id', async () => {
    const response = await request
      .get(`${baseURL}/users/2`)
      .auth(jwt, { type: 'bearer' });
    expect(
      checkIfObjHasAllTheProperties(response.body, ['firstname', 'lastname'])
    ).toBeTruthy();
  });
});
