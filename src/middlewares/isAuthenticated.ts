import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { config } from "../config/config";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Missing authorization headers" });
  }
  let token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, config.secret, (err, decoded) => {
    req.user = decoded;
    if (err) {
      return res.status(401).json({ message: "Missing authorization headers" });
    } else {
      return next();
    }
  });
};
