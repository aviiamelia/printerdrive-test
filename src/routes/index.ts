import { Express } from "express";
import { userRouter } from "./users.route";
import { loginRouter } from "./login.route";
import { folderRouter } from "./folder.route";
import { fileRouter } from "./file.route";

export const routerInit = (app: Express) => {
  app.use("/users", userRouter());
  app.use("/login", loginRouter());
  app.use("/folder", folderRouter());
  app.use("/files", fileRouter());
};
