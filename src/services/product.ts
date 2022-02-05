import { makeProductStore, Product } from "../models/product";

const productStore = makeProductStore();

function index(): Promise<Product[]> {
  return productStore.index();
}

function show(productId: number): Promise<Product> {
  return productStore.show(productId);
}

function create(product: Omit<Product, "id">) {
  return productStore.create(product);
}

export function makeProductService() {
  return { index, show, create };
}
