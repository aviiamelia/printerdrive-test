import { Request, Response, NextFunction } from "express";
import { JwtAdapter } from "../adapters/jwt.adapter";
import { AccessDeniedError } from "../errorHandler/accessDeniedError";
import dotenv from "dotenv";
dotenv.config();
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Missing authorization headers" });
  }
  const token = req.headers.authorization.split(" ")[1];
  const jwt = new JwtAdapter(process.env.JWT_SECRET, process.env.EXPIRESIN);
  const verification = jwt.verify(token);
  if (!verification) {
    throw new AccessDeniedError();
  } else {
    return next();
  }
};
