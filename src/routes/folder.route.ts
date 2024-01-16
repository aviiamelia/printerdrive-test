import { Router } from "express";
import { validate } from "../middlewares/validade.user";
import { FolderController } from "../controllers/folderController";
import { folderSchema } from "../models/folderSchema";
import { upload } from "../middlewares/fileUpload";

const router = Router();

const controller = new FolderController();
export const folderRouter = () => {
  router.post("", validate(folderSchema), controller.create);
  router.post(
    "/upload/:folderId",
    upload.single("file"),
    controller.uploadFile
  );
  return router;
};
