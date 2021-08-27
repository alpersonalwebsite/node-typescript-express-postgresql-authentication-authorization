import { isTheUser } from '../../utils/user';

describe('Utils > User', () => {
  it('can validate a user by id', () => {
    const result = isTheUser(1, 1);
    expect(result).toBeTruthy();
  });
  it('fails if we pass 2 different ids', () => {
    const result = isTheUser(1, 2);
    expect(result).toBeFalsy();
  });
});
