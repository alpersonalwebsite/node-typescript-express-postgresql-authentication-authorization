import bcrypt from 'bcrypt';
import client from '../database';

export type User = {
  id?: number;
  password_digest?: string;
  firstname?: string;
  lastname?: string;
};

export type UserWithCredentials = User & {
  password: string;
};

const { BCRYPT_PASSWORD: pepper, SALT_ROUNDS: saltRounds } = process.env;

export class UserStore {
  async index(): Promise<User[]> {
    const conn = await client.connect();
    try {
      const sql = 'SELECT firstname, lastname FROM users';
      const result = await conn.query(sql);

      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get users, ${String(err)}`);
    } finally {
      conn.release();
    }
  }

  async show(id: string): Promise<User> {
    const conn = await client.connect();
    try {
      // Never fetch password_digest for a plain read; it must not reach clients.
      const sql = 'SELECT id, firstname, lastname FROM users WHERE id=($1)';
      const result = await conn.query(sql, [id]);

      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot get that user, ${String(err)}`);
    } finally {
      conn.release();
    }
  }

  async create(u: UserWithCredentials): Promise<User> {
    const conn = await client.connect();
    try {
      const hash = await bcrypt.hash(
        `${u.password}${pepper}`,
        parseInt(saltRounds as string)
      );
      const sql =
        'INSERT INTO users (firstname, lastname, password_digest) VALUES ($1, $2, $3) RETURNING *';
      const result = await conn.query(sql, [u.firstname, u.lastname, hash]);

      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot create that user, ${String(err)}`);
    } finally {
      conn.release();
    }
  }

  async authenticate(u: UserWithCredentials): Promise<User | null> {
    const conn = await client.connect();
    try {
      const sql = 'SELECT * FROM users WHERE id=($1)';
      const result = await conn.query(sql, [u.id]);
      if (result.rows.length) {
        const user = result.rows[0];
        if (
          await bcrypt.compare(`${u.password}${pepper}`, user.password_digest)
        ) {
          return user;
        }
      }

      return null;
    } catch (err) {
      throw new Error(`Cannot authenticate. ${String(err)}`);
    } finally {
      conn.release();
    }
  }
}
