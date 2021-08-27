import { UserStore } from '../../models/user';
import { ProductStore } from '../../models/product';

const userStore = new UserStore();
const productStore = new ProductStore();

describe('Create test data for testing Order Model', () => {
  describe('Create a user for create order test', () => {
    it('creates a user to be utilized during Order Model tests', async () => {
      const result = await userStore.create({
        firstname: 'Peter',
        lastname: 'Pan',
        password: '123'
      });
      const generated_password_digest = result.password_digest;
      expect(result).toEqual({
        id: 3,
        firstname: 'Peter',
        lastname: 'Pan',
        password_digest: generated_password_digest
      });
    });
  });

  describe('Create a product for create order test', () => {
    it('creates a product with the proper category', async () => {
      const result = await productStore.create({
        name: 'Product 3',
        price: 10,
        category: 'Category 3'
      });
      expect(result).toEqual({
        id: 3,
        name: 'Product 3',
        price: 10,
        category: 'Category 3'
      });
    });
  });
});
