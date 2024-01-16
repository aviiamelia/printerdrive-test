import { Router } from "express";
import { UserController } from "../controllers/userController";
import { validate } from "../middlewares/validade.user";
import { userSchema } from "../models/userSchema";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = Router();

const controller = new UserController();
export const userRouter = () => {
  router.post("", validate(userSchema), controller.create);
  router.get("", isAuthenticated, controller.list);
  return router;
};
