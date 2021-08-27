import { checkIfObjHasAllTheProperties } from '../../utils/validations';

describe('Utils > Validations', () => {
  it('returns true if the object has the expected properties', () => {
    const result = checkIfObjHasAllTheProperties(
      { test: 1, more: '2', other: 'other' },
      ['test', 'more']
    );
    expect(result).toBeTruthy();
  });
});
