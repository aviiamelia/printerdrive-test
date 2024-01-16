import { AppDataSource } from "../data-source";
import { Folder } from "../entities/folderModel";

export const FolderRepo = () => {
  const folderRepo = AppDataSource.getRepository(Folder);
  return folderRepo;
};
