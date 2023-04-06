import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import errors from "../errors/index.js";
dotenv.config();

const { JWT_SECRET } = process.env;

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const user = jwt.verify(token, JWT_SECRET);
    if (user) {
      res.locals.user = user;
      return next();
    }
    throw errors.unauthorizedError();
  } catch (error) {
    throw errors.unauthorizedError();
  }
}
