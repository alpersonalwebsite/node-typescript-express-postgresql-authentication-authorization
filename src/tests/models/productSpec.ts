import { ProductStore } from '../../models/product';

const store = new ProductStore();

describe('Product Model', () => {
  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('creates a product with null category', async () => {
    const result = await store.create({
      name: 'Product 4',
      price: 10
    });
    expect(result).toEqual({
      id: 4,
      name: 'Product 4',
      price: 10,
      category: null
    });
  });

  it('creates a product with the proper category', async () => {
    const result = await store.create({
      name: 'Product 5',
      price: 10,
      category: 'Category 5'
    });
    expect(result).toEqual({
      id: 5,
      name: 'Product 5',
      price: 10,
      category: 'Category 5'
    });
  });

  it('returns a list of products', async () => {
    const result = await store.index();
    expect(result).toEqual([
      { id: 1, name: 'Product 1', price: 11, category: 'Category 1' },
      { id: 2, name: 'Product 1', price: 11, category: 'Category 1' },
      { id: 3, name: 'Product 3', price: 10, category: 'Category 3' },
      { id: 4, name: 'Product 4', price: 10, category: null },
      { id: 5, name: 'Product 5', price: 10, category: 'Category 5' }
    ]);
  });

  it('returns the proper product', async () => {
    const result = await store.show('5');
    expect(result).toEqual({
      id: 5,
      name: 'Product 5',
      price: 10,
      category: 'Category 5'
    });
  });
});
