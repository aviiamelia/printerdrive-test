import { Router } from "express";
import { UserController } from "../controllers/userController";

const router = Router();

const controller = new UserController();
export const userRouter = () => {
  router.post("", controller.create);
  router.get("", controller.list);
  return router;
};
