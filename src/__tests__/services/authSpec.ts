import { makeAuthService } from "../../services/auth";
import jwt from "jsonwebtoken";
import { User } from "../../models/user";

describe("Auth service", () => {
  const authService = makeAuthService();
  it("Creates account", async () => {
    const { me, token } = await authService.createAccount({
      password: "123",
      firstName: "name",
      lastName: "lastName",
      userName: "user123",
    });
    expect(
      (jwt.verify(token, process.env.TOKEN_SECRET ?? "") as { user: User }).user
        .id
    ).toBe(me.id);
  });

  it("Authenticates if a user", async () => {
    const { me } = await authService.createAccount({
      password: "123",
      firstName: "name",
      lastName: "lastName",
      userName: "test-user",
    });

    await authService.authenticate(me.userName, "123");
  });

  it("Fails auth if not a user", async () => {
    await expectAsync(
      authService.authenticate("not-a-user", "123")
    ).toBeRejected();
  });

  it("Fails auth if token is invalid", () => {
    expect(() => authService.isAuthenticated("asd")).toThrowError();
  });

  it("Returns user if token is valid", async () => {
    const { me, token } = await authService.createAccount({
      password: "123",
      firstName: "name",
      lastName: "lastName",
      userName: "jwt-test-user",
    });

    expect(authService.isAuthenticated(token)).toEqual(me);
  });
});
