import client from '../database';

export type Product = {
  id?: number;
  name: string;
  price: number;
  category?: string | null;
};

export class ProductStore {
  async index(): Promise<Product[]> {
    const conn = await client.connect();
    try {
      const sql = 'SELECT * FROM products';
      const result = await conn.query(sql);

      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get products, ${String(err)}`);
    } finally {
      conn.release();
    }
  }

  async show(id: string): Promise<Product> {
    const conn = await client.connect();
    try {
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const result = await conn.query(sql, [id]);

      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot get that product, ${String(err)}`);
    } finally {
      conn.release();
    }
  }

  async create(p: Product): Promise<Product> {
    const conn = await client.connect();
    try {
      const sql =
        'INSERT INTO products (name, price, category) VALUES ($1, $2, $3) RETURNING *';
      const result = await conn.query(sql, [p.name, p.price, p.category]);

      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot create that product, ${String(err)}`);
    } finally {
      conn.release();
    }
  }
}
