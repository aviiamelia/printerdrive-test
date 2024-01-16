import { BcryptAdapter } from "../adapters/bcrypt.adapter";
import { Folder } from "../entities/folderModel";
import { FolderRepo } from "../repository/folder.repository";
import { UserRepo } from "../repository/user.repository";
import { UserModel } from "../entities/userModel";
import { PermissionRepo } from "../repository/permissions.repository";
import { PermissionModel, PermissionType } from "../entities/permissionModel";
import { NoFileUpload } from "../errorHandler/noFileUpaloaded";

export class FolderService {
  async create(folderName: string, parentFolderId?: number, ownerId?: number) {
    const userRepo = UserRepo();
    const permissionRepo = PermissionRepo();
    const user = await userRepo.findOne({ where: { id: ownerId } });
    const folderRepo = FolderRepo();
    const permission = new PermissionModel();

    if (!parentFolderId) {
      const folder = folderRepo.create({
        folderName: folderName,
        user: user as UserModel,
      });
      folderRepo.save(folder);
      permission.user = user;
      permission.folder = folder;
      permission.permissionType = PermissionType.FULL;
      await permissionRepo.save(permission);
      return folder;
    } else {
      const subFolder = new Folder();
      subFolder.user = user;
      const parentFolder = await folderRepo.findOne({
        where: { id: parentFolderId },
      });
      subFolder.folderName = folderName;
      subFolder.parentFolder = parentFolder;
      await folderRepo.save(subFolder);
      return subFolder;
    }
  }
  async uploadFile(foldId: number, file: unknown) {
    const folderId = foldId;
    const folderRepo = FolderRepo();
    const uploadFile = file;
    if (!uploadFile) {
      throw new NoFileUpload();
    }
    const folder = await folderRepo.findOneByOrFail({ id: folderId });
    folder.contentFilePath = uploadFile as string;
    await folderRepo.save(folder);
    return folder;
  }
}
