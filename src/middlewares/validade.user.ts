import { Request, Response, NextFunction } from "express";
import { AnyObject, ObjectSchema } from "yup";
import { ObjectShape } from "yup";

export const validate =
  (schema: ObjectSchema<ObjectShape, AnyObject, any, "">) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    try {
      await schema.validate(data, { abortEarly: true, stripUnknown: true });
      return next();
    } catch (e: any) {
      console.log(e);
      res.status(400).json({ error: e.errors.join(", ") });
    }
  };
