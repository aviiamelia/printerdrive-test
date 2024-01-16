import { FolderService } from "../services/folder.services";
import { Request, Response } from "express";

export class FolderController {
  constructor() {}
  async create(req: Request, res: Response) {
    const folderService = new FolderService();
    try {
      const ownerId = req.body.ownerId;
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
      folderService.uploadFile(folderId, uploadedFile as unknown);
      res.status(201).send({ message: "file uploaded" });
    } catch (error) {
      res.status(201).send({ message: "error" });
      console.log(error);
    }
  }
}
