import { Request, Response } from "express";
import dotenv from "dotenv";
import { LoginService } from "../services/login.services";
import { BcryptAdapter } from "../adapters/bcrypt.adapter";
import { JwtAdapter } from "../adapters/jwt.adapter";
dotenv.config();
export class LoginController {
  constructor() {}

  async login(req: Request, res: Response) {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.EXPIRESIN;
    try {
      const loginService = new LoginService(
        new BcryptAdapter(),
        new JwtAdapter(secret, expiresIn)
      );
      const response = await loginService.login(req.body);
      res.status(200).send({ response });
    } catch (error) {
      res.status(401).send({ message: "wrong email/password" });
    }
  }
}
