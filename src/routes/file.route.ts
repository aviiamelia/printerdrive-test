import { Router } from "express";
import { FileController } from "../controllers/fileController";

const router = Router();

const controller = new FileController();
export const fileRouter = () => {
  router.get("/download/:fileId", controller.download);
  return router;
};
