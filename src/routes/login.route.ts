import { Router } from "express";
import { LoginController } from "../controllers/loginController";
import { validate } from "../middlewares/validade.user";
import { loginSchema } from "../models/loginSchema";
const router = Router();

const controller = new LoginController();

export const loginRouter = () => {
  router.post("", validate(loginSchema), controller.login);
  return router;
};
