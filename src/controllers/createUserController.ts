import { IUser } from "../types/Iuser";
import { Request, Response } from "express";
import { UserService } from "../services/user.services";
import { BcryptAdapter } from "../adapters/bcrypt.adapter";

export class UserController {
  constructor() {}

  async create(req: Request, res: Response) {
    try {
      const userService = new UserService(new BcryptAdapter());
      const data = req.body;
      const user = await userService.create(data);
      res.status(201).send(user);
    } catch (error) {
      console.log(req.body);
      console.log(error);
      res.status(400).send({ title: "error" });
    }
  }
}
