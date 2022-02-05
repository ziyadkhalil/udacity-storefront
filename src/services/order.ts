import { makeUserOrderStore } from "../models/userOrder";

const orderStore = makeUserOrderStore();

export function currentOrder(userId: number) {
  return orderStore.currentOrder(userId);
}

export function completedOrders(userId: number) {
  return orderStore.completedOrders(userId);
}

export async function completeCurrentOrder(userId: number) {
  await orderStore.completeActiveOrder(userId);
  await orderStore.createActiveOrder(userId);
}

export function makeOrderService() {
  return { currentOrder, completedOrders, completeCurrentOrder };
}
