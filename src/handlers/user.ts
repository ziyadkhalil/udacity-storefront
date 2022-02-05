import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { User } from "../models/user";
import { makeAuthService } from "../services/auth";
import { makeUserService } from "../services/user";

const userRouter = Router();

const userServie = makeUserService();
const authService = makeAuthService();

userRouter.get("/", authMiddleware, async (_, res) => {
  try {
    res.json(await userServie.index());
  } catch (e) {
    res.status(404).json(`Could not list users. ${e}`);
  }
});

userRouter.get("/:userName", authMiddleware, async (req, res) => {
  try {
    res.json(await userServie.show(req.params.userName));
  } catch (e) {
    res.status(404).json(`Could not get user ${req.params.userName}. ${e}`);
  }
});

userRouter.post("/create", async (req, res) => {
  try {
    const user = req.body as User;
    const createdUser = await authService.createAccount(user);
    return res.json(createdUser);
  } catch (err) {
    res.status(404).json(`Could not create user. ${err}`);
  }
});

export { userRouter };
