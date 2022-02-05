import { NextFunction, Request, Response } from "express";
import { makeAuthService } from "../services/auth";

const auth = makeAuthService();

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const user = auth.isAuthenticated(token ?? "");
    res.locals.authenticated = true;
    res.locals.user = user;
    next();
  } catch (err) {
    res.status(401).send("Not authorized");
  }
}
