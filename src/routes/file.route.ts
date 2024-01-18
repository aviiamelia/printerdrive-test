import { Router } from "express";
import { FileController } from "../controllers/fileController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = Router();

const controller = new FileController();
export const fileRouter = () => {
  router.get("/download/:fileId", controller.download);
  router.get("/:folderId", isAuthenticated, controller.listFiles);
  return router;
};
