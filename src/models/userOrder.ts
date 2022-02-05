import { db } from "../db";
import { Product } from "./product";

const userOrderTable = "user_order" as const;
const orderProductTable = "order_products" as const;

export type Order = {
  id: number;
  userId: number;
  items: (Product & { quantity: number })[];
  status: "active" | "complete";
};

async function createActiveOrder(userId: number) {
  const conn = await db.connect();
  const sql = `INSERT INTO ${userOrderTable} (user_id, status) VALUES($1, $2) RETURNING *`;
  const results = await conn.query<Order>(sql, [userId, "active"]);
  conn.release();
  return results.rows[0];
}

async function addOrderItem(
  orderId: number,
  item: { id: number; quantity: number }
) {
  const conn = await db.connect();
  const sql = `INSERT INTO ${orderProductTable} (order_id, product_id, quantity) VALUES($1, $2, $3)`;
  await conn.query<Order>(sql, [orderId, item.id, item.quantity]);
  conn.release();
}

async function currentOrder(userId: number): Promise<Order> {
  const conn = await db.connect();
  const sql = `SELECT product.id, order_products.quantity, product.name, product.price, product.category, user_order.id as "orderId", user_order.user_id as "userId", user_order.status FROM ${userOrderTable} LEFT JOIN ${orderProductTable} ON ${userOrderTable}.id = ${orderProductTable}.order_id LEFT JOIN product ON product.id = order_products.product_id WHERE ${userOrderTable}.user_id = ${userId} AND ${userOrderTable}.status = 'active'`;
  const results = await conn.query(sql);
  conn.release();

  if (results.rowCount === 0) throw new Error("No current order");
  let orderItems: Order["items"] = [];
  if (results.rows[0].id !== null) {
    orderItems = results.rows.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      name: item.name,
      price: item.price,
      category: item.category,
    })) as Order["items"];
  }

  return {
    id: results.rows[0].orderId,
    userId: results.rows[0].userId,
    status: results.rows[0].status,
    items: orderItems,
  };
}

async function completeActiveOrder(userId: number) {
  const conn = await db.connect();
  const sql = `UPDATE user_order SET status = 'complete' WHERE user_id = ${userId} AND status = 'active'`;
  await conn.query<Order>(sql);
  conn.release();
}

async function completedOrders(userId: number) {
  const conn = await db.connect();
  const sql = `SELECT product.id, order_products.quantity, product.name, product.price, product.category, user_order.id as "orderId", user_order.user_id as "userId", user_order.status FROM ${userOrderTable} LEFT JOIN ${orderProductTable} ON ${userOrderTable}.id = ${orderProductTable}.order_id LEFT JOIN product ON product.id = order_products.product_id WHERE ${userOrderTable}.user_id = ${userId} AND ${userOrderTable}.status = 'complete'`;
  const result = await conn.query(sql);
  conn.release();
  if (result.rowCount === 0) return [];
  const ordersDict: Record<string, Order> = {};
  result.rows.forEach((row) => {
    if (ordersDict[row.orderId]) {
      ordersDict[row.orderId].items.push({
        id: row.id,
        quantity: row.quantity,
        name: row.name,
        price: row.price,
        category: row.category,
      });
    } else {
      ordersDict[row.orderId] = {
        id: row.orderId,
        items: row.id
          ? [
              {
                id: row.id,
                quantity: row.quantity,
                name: row.name,
                price: row.price,
                category: row.category,
              },
            ]
          : [],
        status: row.status,
        userId: row.userId,
      };
    }
  });

  return Object.values(ordersDict);
}

export function makeUserOrderStore() {
  return {
    createActiveOrder,
    completeActiveOrder,
    addOrderItem,
    currentOrder,
    completedOrders,
  };
}
