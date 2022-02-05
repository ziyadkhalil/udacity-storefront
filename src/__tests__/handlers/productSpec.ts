import supertest from "supertest";

import app from "../../index";
import { makeUserStore } from "../../models/user";
import { makeAuthService } from "../../services/auth";

const request = supertest(app);

const authService = makeAuthService();
const userModel = makeUserStore();

describe("Product handler", () => {
  let token: string;
  let productId: number;
  beforeAll(async () => {
    token = (
      await authService.createAccount({
        userName: "my-test-user",
        firstName: "First",
        lastName: "Last",
        password: "mypassword",
      })
    ).token;
  });

  it("Lists products", async () => {
    const res = await request.get("/api/product");
    expect(res.status).toBe(200);
  });

  it("Creates a product if authorized", async () => {
    const res = await request
      .post("/api/product/create")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "test-product", price: 200, category: "test" });
    productId = res.body.id;
    expect(res.status).toBe(200);
  });

  it("Fails creating a product if unauthorized", async () => {
    const res = await request
      .post("/api/product/create")
      .send({ name: "test-product", price: 200, category: "test" });
    expect(res.status).toBe(401);
  });

  it("Shows a product by id", async () => {
    const res = await request.get(`/api/product/${productId}`);
    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    await userModel.deleteAll();
  });
});
