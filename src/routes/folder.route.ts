import { Router } from "express";
import { validate } from "../middlewares/validade.user";
import { FolderController } from "../controllers/folderController";
import { folderSchema } from "../models/folderSchema";

const router = Router();

const controller = new FolderController();
export const folderRouter = () => {
  router.post("", validate(folderSchema), controller.create);
  return router;
};
