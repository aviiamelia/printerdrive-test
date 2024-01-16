import { Request, Response, NextFunction } from "express";

export const isAdiminstrator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user.isAdmin !== true) {
    return res.status(401).send({
      message: "Unauthorized",
    });
  }
  return next();
};
