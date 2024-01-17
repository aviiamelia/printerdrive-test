import { EntityNotFoundError } from "typeorm";
import { PermissionType } from "../entities/permissionModel";
import { AccessDeniedError } from "../errorHandler/accessDeniedError";
import { FolderService } from "../services/folder.services";
import { Request, Response } from "express";
import { NotFoundError } from "../errorHandler/notFoundError";
import * as path from "path";
import * as fs from "fs";
import archiver from "archiver";
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
      const uploadedFiles = req.files as Express.Multer.File[];
      await folderService.uploadFile(
        folderId,
        userId,
        req.user.isAdmin,
        uploadedFiles
      );
      res.status(201).send({ message: "file uploaded" });
    } catch (error) {
      if (error instanceof AccessDeniedError) {
        const error = new AccessDeniedError();
        res.status(401).send({ error: error.message });
      } else {
        console.log(error);
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
  async updateFolder(req: Request, res: Response) {
    const folderService = new FolderService();
    try {
      const folderId = parseInt(req.params.folderId);
      const newName = req.query.folderName;
      const userId = parseInt(req.user.id, 10);
      const response = await folderService.updateFolder(
        folderId,
        newName as string,
        userId,
        req.user.isAdmin
      );
      res.status(200).send(response);
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
  async downloadFolder(req: Request, res: Response) {
    const folderService = new FolderService();
    try {
      const folderId = parseInt(req.params.folderId);
      const data = await folderService.downloadFolder(folderId);

      const zipFilePath = path.join(
        __dirname,
        "..",
        "..",
        "uploads",
        data.zipFileName
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${data.zipFileName}.zip"`
      );

      fs.readdirSync(zipFilePath);
      const archive = archiver("zip", { zlib: { level: 0 } });
      archive.pipe(res);
      archive.on("error", (err) => {
        console.error(err);
        res.status(400).send("bad request");
      });
      data.files.forEach((file) => {
        const filePath = path.join(
          __dirname,
          "..",
          "..",
          "uploads",
          file.fileName
        );
        archive.file(filePath, { name: file.fileName });
      });
      archive.finalize();
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: "bad request" });
    }
  }
  async listFolders(req: Request, res: Response) {
    const folderService = new FolderService();
    try {
      const userId = req.user.id;
      const response = await folderService.listFolders(userId);
      res.status(200).send(response);
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: "bad request" });
    }
  }
  async listSharedFolders(req: Request, res: Response) {
    const folderService = new FolderService();
    try {
      const userId = req.user.id;
      const response = await folderService.listSharedFolders(userId);
      res.status(200).send(response);
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: "bad request" });
    }
  }
}
