import { AppDataSource } from "../data-source";
import { FileModel } from "../entities/filesModel";

export const FileRepo = () => {
  const fileRepo = AppDataSource.getRepository(FileModel);
  return fileRepo;
};
