import { Request, Response } from "express";
import { UserService } from "../services/user.services";
import { BcryptAdapter } from "../adapters/bcrypt.adapter";
import { DuplicatedKey } from "../errorHandler/älredyExistError";
import { AccessDeniedError } from "../errorHandler/accessDeniedError";
import { UserModel } from "../entities/userModel";

export class UserController {
  constructor() {}

  async create(req: Request, res: Response) {
    try {
      const userService = new UserService(new BcryptAdapter());
      const data: UserModel = req.body;
      const user = await userService.create(data);
      res.status(201).send(user);
    } catch (error) {
      switch (error.driverError.code) {
        case "23505":
          let errorMessage = new DuplicatedKey();
          res.status(409).send({ error: errorMessage.message });
      }
    }
  }

  async list(_, res: Response) {
    try {
      const userService = new UserService(new BcryptAdapter());
      const users = await userService.list();
      res.status(200).send(users);
      return users;
    } catch (error) {
      if (error instanceof AccessDeniedError) {
        const error = new AccessDeniedError();
        res.status(404).send({ error: error.message });
      } else {
        console.log(error);
        res.status(400).send({ error: "bad request" });
      }
    }
  }
}
