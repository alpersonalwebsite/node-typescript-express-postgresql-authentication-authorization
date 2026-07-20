import client from '../database';

export type Order = {
  id?: number;
  status: 'active' | 'complete';
  user_id: number;
};

export type ProductsInOrder = {
  id?: number;
  quantity: number;
  order_id: number;
  product_id: number;
  user_id?: number;
};

export class OrderStore {
  async index(): Promise<Order[]> {
    const conn = await client.connect();
    try {
      const sql = 'SELECT * FROM orders';
      const result = await conn.query(sql);

      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get orders, ${String(err)}`);
    } finally {
      conn.release();
    }
  }

  async show(id: string): Promise<Order> {
    const conn = await client.connect();
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      const result = await conn.query(sql, [id]);

      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot get that order, ${String(err)}`);
    } finally {
      conn.release();
    }
  }

  async create(o: Order): Promise<Order> {
    const conn = await client.connect();
    try {
      const sql =
        'INSERT INTO orders (status, user_id) VALUES ($1, $2) RETURNING *';
      const result = await conn.query(sql, [o.status, o.user_id]);

      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot create that order, ${String(err)}`);
    } finally {
      conn.release();
    }
  }

  async addProduct(p: ProductsInOrder): Promise<ProductsInOrder> {
    const conn = await client.connect();
    try {
      const sqlSelectOrder = 'SELECT * FROM orders WHERE id=($1)';
      const resultSelectOrder = await conn.query(sqlSelectOrder, [p.order_id]);
      const orderStatus = resultSelectOrder.rows[0];

      if (!orderStatus) {
        throw new Error(`Invalid order`);
      }

      if (orderStatus.user_id !== p.user_id) {
        throw new Error(`Invalid user`);
      }

      if (orderStatus.status !== 'active') {
        throw new Error(`We cannot add products to that order`);
      }

      const sqlSelectProduct = 'SELECT * FROM products WHERE id=($1)';
      const resultSelectProduct = await conn.query(sqlSelectProduct, [
        p.product_id
      ]);
      const product = resultSelectProduct.rows[0];

      if (!product) {
        throw new Error(`We don't have that product`);
      }

      const sql =
        'INSERT INTO orders_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';
      const result = await conn.query(sql, [
        p.quantity,
        p.order_id,
        p.product_id
      ]);

      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot add a product, ${String(err)}`);
    } finally {
      conn.release();
    }
  }
}
