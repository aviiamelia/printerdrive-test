import { Express } from "express";
import { userRouter } from "./users.route";

export const routerInit = (app: Express) => {
  app.use("/users", userRouter());
  app.use("/login", () => null);
};
