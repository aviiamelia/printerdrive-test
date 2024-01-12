import { Router } from "express";
import { UserController } from "../controllers/createUserController";
import { UserService } from "../services/user.services";
import { UserRepo } from "../repository/user.repository";
import { BcryptAdapter } from "../adapters/bcrypt.adapter";

const router = Router();

const controller = new UserController();
export const userRouter = () => {
  router.post("", controller.create);
  return router;
};
