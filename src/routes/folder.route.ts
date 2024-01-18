import { Router } from "express";
import { validate } from "../middlewares/validade.user";
import { FolderController } from "../controllers/folderController";
import { folderSchema } from "../models/folderSchema";
import { upload } from "../middlewares/fileUpload";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isAdiminstrator } from "../middlewares/isAdmin";

const router = Router();

const controller = new FolderController();
export const folderRouter = () => {
  router.post("", validate(folderSchema), isAuthenticated, controller.create);
  router.get("", isAuthenticated, controller.listFolders);
  router.get("/sharedfolders", isAuthenticated, controller.listSharedFolders);
  router.post(
    "/upload/:folderId",
    isAuthenticated,
    upload.array("files"),
    controller.uploadFile
  );
  router.delete("/:folderId", isAuthenticated, controller.deleteFolder);
  router.patch("/:folderId", isAuthenticated, controller.updateFolder);
  router.patch(
    "/:folderId/:userId/:permissionType",
    isAuthenticated,
    isAdiminstrator,
    controller.giveFolderPermission
  );
  router.get("/download/:folderId", controller.downloadFolder);
  return router;
};
