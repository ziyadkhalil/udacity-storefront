import { db } from "../db";

const productTable = "product" as const;

export type Product = {
  id: number;
  name: string;
  price: number;
  category: string | null;
};

async function index(): Promise<Product[]> {
  const conn = await db.connect();
  const sql = "SELECT * FROM product";
  const result = await conn.query<Product>(sql);
  conn.release();
  return result.rows;
}

export class ShowProductError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ShowProductError";
  }
}

async function show(productId: number): Promise<Product> {
  try {
    const conn = await db.connect();
    const sql = `SELECT * FROM ${productTable} WHERE id = ${productId}`;
    const result = await conn.query<Product>(sql);
    conn.release();
    if (!result.rows[0])
      throw new ShowProductError(`Could not find product ${productId}`);
    return result.rows[0];
  } catch (error) {
    if (error instanceof ShowProductError) {
      throw error;
    }
    throw new ShowProductError(
      `An errour occured, Could not find product ${productId}. error: ${error}`
    );
  }
}

async function create(product: Omit<Product, "id">): Promise<Product> {
  const conn = await db.connect();
  const sql = `INSERT INTO ${productTable} (name, price, category) VALUES($1, $2, $3) RETURNING *`;
  const result = await conn.query<Product>(sql, [
    product.name,
    product.price,
    product.category,
  ]);
  conn.release();
  return result.rows[0];
}

// async function top5(): Promise<[Product, Product, Product, Product, Product]> {}

async function productByCategory(category: string): Promise<Product[]> {
  const conn = await db.connect();
  const sql = `SELECT * FROM ${productTable} WHERE category = ${category}`;
  const result = await conn.query<Product>(sql);
  conn.release();
  return result.rows;
}

export function makeProductStore() {
  return { index, show, create, productByCategory };
}
