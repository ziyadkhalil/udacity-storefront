import { db } from "../db";

const tableName = "store_users" as const;

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  password: string;
};

async function index(): Promise<User[]> {
  const conn = await db.connect();
  const sql = `SELECT id, first_name as "firstName" , last_name as "lastName" FROM ${tableName}`;
  const result = await conn.query<User>(sql);
  conn.release();
  return result.rows;
}

export class ShowUserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ShowUserError";
  }
}

async function show(userId: number): Promise<User> {
  try {
    const conn = await db.connect();
    const sql = `SELECT id, first_name as "firstName", last_name as "lastName" FROM ${tableName} WHERE id = ${userId}`;
    const result = await conn.query<User>(sql);
    conn.release();
    if (!result.rows[0])
      throw new ShowUserError(`Could not find user ${userId}`);
    return result.rows[0];
  } catch (error) {
    if (error instanceof ShowUserError) {
      throw error;
    }
    throw new ShowUserError(
      `An errour occured, Could not find product ${userId}. error: ${error}`
    );
  }
}

async function create(user: Omit<User, "id">): Promise<Omit<User, "password">> {
  const conn = await db.connect();
  const sql = `INSERT INTO ${tableName} (first_name, last_name, password) VALUES($1, $2, $3) RETURNING first_name AS "firstName", last_name AS "lastName", id`;
  const result = await conn.query<User>(sql, [
    user.firstName,
    user.lastName,
    user.password,
  ]);

  conn.release();
  return result.rows[0];
}

export function makeUserStore() {
  return { index, show, create };
}
