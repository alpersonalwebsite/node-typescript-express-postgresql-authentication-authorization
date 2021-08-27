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

const { CRYPT_PASSWORD: pepper, SALT_ROUNDS: saltRounds } = process.env;

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT firstname, lastname FROM users';
      const result = await conn.query(sql);
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get users, ${err}`);
    }
  }

  async show(id: string): Promise<User> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM users WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot get that user, ${err}`);
    }
  }

  async create(u: UserWithCredentials): Promise<User> {
    try {
      const conn = await client.connect();
      const hash = bcrypt.hashSync(
        `${u.password}${pepper}`,
        parseInt(saltRounds as string)
      );
      const sql =
        'INSERT INTO users (firstname, lastname, password_digest) VALUES ($1, $2, $3) RETURNING *';
      const result = await conn.query(sql, [u.firstname, u.lastname, hash]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot create that user, ${err}`);
    }
  }

  async authenticate(u: UserWithCredentials): Promise<User | null> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM users WHERE id=($1)';
      const result = await conn.query(sql, [u.id]);
      if (result.rows.length) {
        const user = result.rows[0];
        if (
          bcrypt.compareSync(`${u.password}${pepper}`, user.password_digest)
        ) {
          return user;
        }
      }
      conn.release();

      return null;
    } catch (err) {
      throw new Error(`Cannot authenticate. ${err}`);
    }
  }
}
