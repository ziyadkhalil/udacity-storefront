import { makeProductStore, ShowProductError } from "../../models/product";

describe("Product store", () => {
  const productStore = makeProductStore();

  it("Adds a product to product table and returns it", async () => {
    const createdProudct = await productStore.create({
      name: "test product",
      price: 200,
      category: null,
    });
    expect(createdProudct.name).toBe("test product");
  });

  it("Lists products", async () => {
    const products = await productStore.index();
    expect(products.length).toBeGreaterThanOrEqual(0);
  });

  it("Gets a product if it exists", async () => {
    const createdProudct = await productStore.create({
      name: "test product",
      price: 200,
      category: null,
    });
    const productFromShow = await productStore.show(createdProudct.id);
    expect(productFromShow.id).toBe(createdProudct.id);
  });

  const error = new ShowProductError(`Could not find product ${-1}`);

  it("Throws if a product doesn't exist", async () => {
    await expectAsync(productStore.show(-1)).toBeRejectedWith(error);
  });
});
