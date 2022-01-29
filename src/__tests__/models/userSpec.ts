import { makeUserStore, ShowUserError, User } from "../../models/user";

describe("User store", () => {
  const userStore = makeUserStore();

  it("Adds a user to users table and returns them without password", async () => {
    const createdUser = await userStore.create({
      firstName: "Test-first",
      lastName: "Test-last",
      password: "password",
    });
    expect(createdUser.firstName).toBe("Test-first");
    expect((createdUser as User).password).toBeUndefined();
  });

  it("Lists users", async () => {
    const users = await userStore.index();
    expect(users.length).toBeGreaterThanOrEqual(0);
  });

  it("Gets a user if they exist", async () => {
    const createdUser = await userStore.create({
      firstName: "Test-first",
      lastName: "Test-last",
      password: "password",
    });
    const userFromShow = await userStore.show(createdUser.id);
    expect(userFromShow.id).toBe(createdUser.id);
  });

  const error = new ShowUserError(`Could not find user ${-1}`);

  it("Throws if a user doesn't exist", async () => {
    await expectAsync(userStore.show(-1)).toBeRejectedWith(error);
  });
});
