import { makeUserStore } from "../../models/user";
import { makeUserOrderStore } from "../../models/userOrder";
import { makeProductStore } from "../../models/product";
describe("User order store", () => {
  const userStore = makeUserStore();
  const userOrderStore = makeUserOrderStore();
  const productStore = makeProductStore();

  it("Creates active order for user", async () => {
    const user = await userStore.create({
      userName: "test-user-3",
      firstName: "test-1",
      lastName: "test-1",
      password: "password",
    });
    await userOrderStore.createActiveOrder(user.id);
  });

  it("Adds an item to active order", async () => {
    const product1 = await productStore.create({
      name: "test-product-1",
      price: 250,
      category: null,
    });

    const product2 = await productStore.create({
      name: "test-product-1",
      price: 250,
      category: null,
    });

    const user = await userStore.create({
      userName: "test-user-2",
      firstName: "test-1",
      lastName: "test-1",
      password: "password",
    });

    const { id: activeOrderId } = await userOrderStore.createActiveOrder(
      user.id
    );

    await userOrderStore.addOrderItem(activeOrderId, {
      id: product1.id,
      quantity: 2,
    });
    await userOrderStore.addOrderItem(activeOrderId, {
      id: product2.id,
      quantity: 4,
    });
  });

  it("Gets current order of a user", async () => {
    const user = await userStore.create({
      userName: "test-user-4",
      firstName: "test-1",
      lastName: "test-1",
      password: "password",
    });

    const product1 = await productStore.create({
      name: "test-product-1",
      price: 250,
      category: null,
    });

    const product2 = await productStore.create({
      name: "test-product-1",
      price: 250,
      category: null,
    });

    const { id: activeOrderId } = await userOrderStore.createActiveOrder(
      user.id
    );
    await userOrderStore.addOrderItem(activeOrderId, {
      id: product1.id,
      quantity: 2,
    });
    await userOrderStore.addOrderItem(activeOrderId, {
      id: product2.id,
      quantity: 4,
    });

    const order = await userOrderStore.currentOrder(user.id);

    expect(order.userId).toBe(user.id);
    expect(order.items.length).toBe(2);
    expect(order.items[0].id).toBe(product1.id);
    expect(order.items[1].id).toBe(product2.id);
  });

  it("Completes active order", async () => {
    const user = await userStore.create({
      userName: "randomUser",
      firstName: "test-1",
      lastName: "test-1",
      password: "password",
    });

    await userOrderStore.createActiveOrder(user.id);

    await userOrderStore.completeActiveOrder(user.id);

    await expectAsync(
      userOrderStore.currentOrder(user.id)
    ).toBeRejectedWithError();
  });

  it("Gets complete orders", async () => {
    const product1 = await productStore.create({
      name: "test-product-1",
      price: 250,
      category: null,
    });

    const product2 = await productStore.create({
      name: "test-product-1",
      price: 250,
      category: null,
    });

    const user = await userStore.create({
      userName: "test-user-1",
      firstName: "test-1",
      lastName: "test-1",
      password: "password",
    });

    let activeOrder = await userOrderStore.createActiveOrder(user.id);

    await userOrderStore.addOrderItem(activeOrder.id, {
      id: product1.id,
      quantity: 2,
    });

    await userOrderStore.completeActiveOrder(user.id);

    activeOrder = await userOrderStore.createActiveOrder(user.id);

    await userOrderStore.addOrderItem(activeOrder.id, {
      id: product2.id,
      quantity: 2,
    });

    await userOrderStore.addOrderItem(activeOrder.id, {
      id: product1.id,
      quantity: 9,
    });

    await userOrderStore.completeActiveOrder(user.id);

    const completeOrders = await userOrderStore.completedOrders(user.id);

    expect(completeOrders.length).toBe(2);
    expect(completeOrders[0].items.length).toBe(1);
    expect(completeOrders[0].status).toBe("complete");
    expect(completeOrders[1].status).toBe("complete");
    expect(completeOrders[0].items[0].id).toBe(product1.id);
    expect(completeOrders[1].items.length).toBe(2);
    expect(completeOrders[1].items[0].quantity).toBe(2);
    expect(completeOrders[1].items[1].quantity).toBe(9);
  });
});
