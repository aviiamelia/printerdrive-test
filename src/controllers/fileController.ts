import { FilesSevice } from "../services/files.services";
import { Request, Response } from "express";
import * as path from "path";
export class FileController {
  constructor() {}
  async download(req: Request, res: Response) {
    try {
      const fileService = new FilesSevice();
      const fileId = parseInt(req.params.fileId, 10);
      const file = await fileService.download(fileId);
      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "uploads",
        file.fileName
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${file.fileName}`
      );
      res.setHeader("Content-Type", "application/octet-stream");
      res.status(200).sendFile(filePath);
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: "bad request" });
    }
  }
  async listFiles(req: Request, res: Response) {
    const filesService = new FilesSevice();
    try {
      const folderId = parseInt(req.params.folderId);
      const response = await filesService.listFiles(folderId);
      res.status(200).send(response);
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: "bad request" });
    }
  }
}
