import supertest from "supertest";

import app from "../../index";
import { makeUserStore } from "../../models/user";
import { makeAuthService } from "../../services/auth";

const request = supertest(app);

const authService = makeAuthService();
const userModel = makeUserStore();

describe("User handler", () => {
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

  it("Lists users if authorized", async () => {
    const res = await request
      .get("/api/user")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("Fails listing users if unauthorized", async () => {
    const res = await request.get("/api/user");
    expect(res.statusCode).toBe(401);
  });

  it("Shows user if authorized", async () => {
    const res = await request
      .get("/api/user/my-test-user")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it("Fails showing user if unauthorized", async () => {
    const res = await request.get("/api/user/my-test-user");
    expect(res.status).toBe(401);
  });

  it("Creates a user", async () => {
    const res = await request.post("/api/user/create").send({
      userName: "my-user-name",
      firstName: "first-name",
      lastName: "last-name",
      password: "password",
    });
    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    await userModel.deleteAll();
  });
});
