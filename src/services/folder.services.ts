import { BcryptAdapter } from "../adapters/bcrypt.adapter";
import { Folder } from "../entities/folderModel";
import { FolderRepo } from "../repository/folder.repository";
import { UserRepo } from "../repository/user.repository";
import { UserModel } from "../entities/userModel";
import { PermissionRepo } from "../repository/permissions.repository";
import { PermissionModel, PermissionType } from "../entities/permissionModel";

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
      console.log(folder);
      folderRepo.save(folder);
      permission.user = user;
      permission.folder = folder;
      permission.permissionType = PermissionType.FULL;
      await permissionRepo.save(permission);
    } else {
      const subFolder = new Folder();
      const parentFolder = await folderRepo.findOne({
        where: { id: parentFolderId },
      });
      subFolder.folderName = folderName;
      subFolder.parentFolder = parentFolder;

      await folderRepo.save(subFolder);
      const folder = folderRepo.create();
      await folderRepo.save(folder);
    }
  }
}
