import { Express } from "express";

export const list = async (req, res) => {
  res.send({ title: "hellow" });
};

export const routerInit = (app: Express) => {
  app.use("/users", list);
  app.use("/login", () => null);
};
