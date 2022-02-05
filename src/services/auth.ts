import { makeUserStore, User } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { makeUserOrderStore } from "../models/userOrder";
const {
  BCRYPT_PASSWORD: pepper,
  SALT_ROUNDS: saltRounds,
  TOKEN_SECRET: jwtSecret,
} = process.env;

const userStore = makeUserStore();
const orderStore = makeUserOrderStore();

async function createAccount(
  user: Omit<User, "id">
): Promise<{ me: Omit<User, "password">; token: string }> {
  if (!pepper || !saltRounds || !jwtSecret)
    throw new Error("Missing environment variables");
  const hash = await bcrypt.hash(user.password + pepper, parseInt(saltRounds));
  const createdUser = await userStore.create({ ...user, password: hash });
  await orderStore.createActiveOrder(createdUser.id);
  const token = jwt.sign({ user: createdUser }, jwtSecret);
  return {
    me: createdUser,
    token,
  };
}

async function authenticate(
  userName: string,
  password: string
): Promise<{ me: Omit<User, "password">; token: string }> {
  try {
    if (!pepper || !saltRounds || !jwtSecret)
      throw new Error("Missing environment variables");
    const { password: hash, ...user } = await userStore.showUserWithHash(
      userName
    );
    const isAuth = await bcrypt.compare(password + pepper, hash);
    if (!isAuth) throw new Error();
    const token = jwt.sign({ user }, jwtSecret);
    return {
      me: user,
      token,
    };
  } catch (err) {
    throw new Error("Unauthorized");
  }
}

function isAuthenticated(token: string): Omit<User, "password"> {
  if (!pepper || !saltRounds || !jwtSecret)
    throw new Error("Missing environment variables");
  try {
    const decoded = jwt.verify(token, jwtSecret) as {
      user: Omit<User, "password">;
    };
    return decoded.user;
  } catch (err) {
    throw new Error("Unauthorized");
  }
}

export function makeAuthService() {
  return { authenticate, isAuthenticated, createAccount };
}
