import supertest from "supertest";

import app from "../../index";
import { makeUserStore } from "../../models/user";
import { makeAuthService } from "../../services/auth";

const request = supertest(app);

const authService = makeAuthService();
const userModel = makeUserStore();

describe("Order handler", () => {
  let token: string;

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

  it("Shows current order if authorized", async () => {
    const res = await request
      .get("/api/order/current")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("Fails showing current order if unauthorized", async () => {
    const res = await request.get("/api/order/current");
    expect(res.status).toBe(401);
  });

  it("Shows complete orders if authorized", async () => {
    const res = await request
      .get("/api/order/complete")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("Fails showing complete orders if unauthorized", async () => {
    const res = await request.get("/api/order/current");
    expect(res.status).toBe(401);
  });

  it("Completes current active order if authorized", async () => {
    const res = await request
      .post("/api/order")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("Fails completing current active order if unauthorized", async () => {
    const res = await request.post("/api/order");

    expect(res.status).toBe(401);
  });

  afterAll(async () => {
    await userModel.deleteAll();
  });
});
