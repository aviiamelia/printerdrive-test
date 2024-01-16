import { EntityNotFoundError } from "typeorm";
import { PermissionType } from "../entities/permissionModel";
import { AccessDeniedError } from "../errorHandler/accessDeniedError";
import { FolderService } from "../services/folder.services";
import { Request, Response } from "express";
import { NotFoundError } from "../errorHandler/notFoundError";

export class FolderController {
  constructor() {}
  async create(req: Request, res: Response) {
    const folderService = new FolderService();
    try {
      const ownerId = req.user.id;
      const folderName = req.body.folderName;
      const parentFolder = req.body.parentFolderId || "";
      const folder = await folderService.create(
        folderName,
        parentFolder,
        ownerId
      );
      res.status(201).send(folder);
    } catch (error) {
      console.log(error);
      res.status(409).send({ message: "deu ruim" });
    }
  }
  async uploadFile(req: Request, res: Response) {
    const folderService = new FolderService();
    try {
      const folderId = parseInt(req.params.folderId, 10);
      const uploadedFile = req.file;
      const userId = parseInt(req.user.id, 10);
      await folderService.uploadFile(
        folderId,
        uploadedFile as unknown,
        userId,
        req.user.isAdmin
      );
      res.status(201).send({ message: "file uploaded" });
    } catch (error) {
      if (error instanceof AccessDeniedError) {
        const error = new AccessDeniedError();
        res.status(401).send({ error: error.message });
      } else {
        res.status(400).send({ message: "bad request" });
      }
    }
  }
  async deleteFolder(req: Request, res: Response) {
    const folderService = new FolderService();
    try {
      const folderId = parseInt(req.params.folderId, 10);
      const userId = parseInt(req.user.id, 10);
      await folderService.deleteFolder(folderId, userId, req.user.isAdmin);
      res.status(200).send({ message: "folder deleted" });
    } catch (error) {
      if (error instanceof AccessDeniedError) {
        const error = new AccessDeniedError();
        res.status(401).send({ error: error.message });
      } else if (
        error instanceof EntityNotFoundError ||
        error instanceof NotFoundError
      ) {
        const error = new NotFoundError();
        res.status(404).send({ error: error.message });
      } else {
        res.status(400).send({ message: "bad request" });
      }
    }
  }
  async giveFolderPermission(req: Request, res: Response) {
    const folderService = new FolderService();
    try {
      const userId = parseInt(req.params.userId);
      const folderId = parseInt(req.params.folderId);
      const permissionType = req.params.permissionType as PermissionType;
      await folderService.giveFolderPermission(
        userId,
        folderId,
        permissionType
      );
      res.status(200).send({ message: "permission granted" });
    } catch (error) {
      if (error instanceof AccessDeniedError) {
        const error = new AccessDeniedError();
        res.status(404).send({ error: error.message });
      } else {
        console.log(error);
        res.status(400).send({ message: "bad request" });
      }
    }
  }
}
