import { UserStore } from '../../models/user';

const store = new UserStore();

describe('User Model', () => {
  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should have an authenticate method', () => {
    expect(store.authenticate).toBeDefined();
  });

  it('creates a user', async () => {
    const result = await store.create({
      firstname: 'Peter',
      lastname: 'Parker',
      password: '1234'
    });
    const generated_password_digest = result.password_digest;
    expect(result).toEqual({
      id: 4,
      firstname: 'Peter',
      lastname: 'Parker',
      password_digest: generated_password_digest
    });
  });

  it('returns a list of users', async () => {
    const result = await store.index();
    expect(result).toEqual([
      { firstname: 'Peter', lastname: 'Parker' },
      { firstname: 'Peter', lastname: 'Parker' },
      { firstname: 'Peter', lastname: 'Pan' },
      { firstname: 'Peter', lastname: 'Parker' }
    ]);
  });

  it('returns the proper user', async () => {
    const result = await store.show('4');
    const generated_password_digest = result.password_digest;
    expect(result).toEqual({
      id: 4,
      firstname: 'Peter',
      lastname: 'Parker',
      password_digest: generated_password_digest
    });
  });

  it('auhenticates with the proper data', async () => {
    const result = await store.authenticate({
      id: 4,
      password: '1234'
    });
    expect(result).toBeTruthy();
  });

  it('returns null if authentication fails', async () => {
    const result = await store.authenticate({
      id: 4,
      password: '12'
    });
    expect(result).toBeNull();
  });
});
