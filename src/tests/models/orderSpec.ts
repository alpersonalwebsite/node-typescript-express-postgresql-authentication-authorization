import { OrderStore } from '../../models/order';

const store = new OrderStore();

describe('Order Model', () => {
  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should have an addProduct method', () => {
    expect(store.addProduct).toBeDefined();
  });

  it('creates an order', async () => {
    const result = await store.create({
      status: 'active',
      user_id: 1
    });
    expect(result).toEqual({
      id: 2,
      status: 'active',
      user_id: 1
    });
  });

  it('returns a list of orders', async () => {
    const result = await store.index();
    expect(result).toEqual([
      {
        id: 1,
        status: 'active',
        user_id: 1
      },
      { id: 2, status: 'active', user_id: 1 }
    ]);
  });

  it('returns the proper order', async () => {
    const result = await store.show('1');
    expect(result).toEqual({
      id: 1,
      status: 'active',
      user_id: 1
    });
  });

  it('adds a product to an active order', async () => {
    const result = await store.addProduct({
      quantity: 10,
      order_id: 1,
      product_id: 1,
      user_id: 1
    });
    expect(result).toEqual({
      id: 1,
      order_id: 1,
      product_id: 1,
      quantity: 10
    });
  });

  it('fails if we try to add a product to a product to a non-existent order', async () => {
    await expectAsync(
      store.addProduct({
        quantity: 10,
        order_id: 1000,
        product_id: 1,
        user_id: 1
      })
    ).toBeRejectedWithError(
      Error,
      'Cannot add a product, Error: Invalid order'
    );
  });

  it('fails if we try to add a product to a product with a different id than the owner of the order', async () => {
    await expectAsync(
      store.addProduct({
        quantity: 10,
        order_id: 1,
        product_id: 1,
        user_id: 2
      })
    ).toBeRejectedWithError(Error, 'Cannot add a product, Error: Invalid user');
  });

  it('creates a complete order', async () => {
    const result = await store.create({
      status: 'complete',
      user_id: 1
    });
    expect(result).toEqual({
      id: 3,
      status: 'complete',
      user_id: 1
    });
  });

  it('fails if we try to add products to an order with status different than active', async () => {
    await expectAsync(
      store.addProduct({
        quantity: 10,
        order_id: 3,
        product_id: 1,
        user_id: 1
      })
    ).toBeRejectedWithError(
      Error,
      'Cannot add a product, Error: We cannot add products to that order'
    );
  });

  it('fails if we try to add a non-existent product', async () => {
    await expectAsync(
      store.addProduct({
        quantity: 10,
        order_id: 1,
        product_id: 100,
        user_id: 1
      })
    ).toBeRejectedWithError(
      Error,
      `Cannot add a product, Error: We don't have that product`
    );
  });
});
