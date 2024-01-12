import { Request, Response, NextFunction } from "express";

export const isAdiminstrator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user.uuid === req.params.uuid) {
    return next();
  }
  if (req.user.isAdm !== true) {
    if (req.params.uuid !== undefined) {
      return res.status(401).send({
        message: "Missing admin permissions",
      });
    }
    return res.status(401).send({
      message: "Unauthorized",
    });
  }
  return next();
};
