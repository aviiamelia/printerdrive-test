import { BcryptAdapter } from "../adapters/bcrypt.adapter";
import { Folder } from "../entities/folderModel";
import { FolderRepo } from "../repository/folder.repository";
import { UserRepo } from "../repository/user.repository";
import { UserModel } from "../entities/userModel";
import { PermissionRepo } from "../repository/permissions.repository";
import { PermissionModel, PermissionType } from "../entities/permissionModel";
import { NoFileUpload } from "../errorHandler/noFileUpaloaded";
import { AccessDeniedError } from "../errorHandler/accessDeniedError";
import { NotFoundError } from "../errorHandler/notFoundError";

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
  async uploadFile(
    foldId: number,
    file: unknown,
    currentUserId: number,
    isAdmin: boolean
  ) {
    const folderRepo = FolderRepo();
    const uploadFile = file;
    if (!uploadFile) {
      throw new NoFileUpload();
    }
    const permissionRepo = PermissionRepo();
    let isAllowed = false;
    const permissionsToDelete = await permissionRepo.find({
      where: { folder: { id: foldId } },
      relations: ["user.permissions"],
    });
    if (permissionsToDelete.length === 0) {
      throw new NotFoundError();
    }
    if (!isAllowed) {
      permissionsToDelete.map((permission) => {
        if (
          permission.user.id === currentUserId &&
          (permission.permissionType === PermissionType.FULL ||
            permission.permissionType === PermissionType.WRITER)
        ) {
          isAllowed = true;
        }
      });
    }
    if (isAdmin) {
      isAllowed = true;
    }
    if (isAllowed) {
      const folder = await folderRepo.findOneByOrFail({ id: foldId });
      folder.contentFilePath = uploadFile as string;
      await folderRepo.save(folder);
      return folder;
    } else {
      throw new AccessDeniedError();
    }
  }
  async deleteFolder(
    folderId: number,
    currentUserId: number,
    isAdmin: boolean
  ) {
    const permissionRepo = PermissionRepo();
    let isAllowed = false;
    const permissionsToDelete = await permissionRepo.find({
      where: { folder: { id: folderId } },
      relations: ["user.permissions"],
    });
    if (permissionsToDelete.length === 0) {
      throw new NotFoundError();
    }
    if (!isAllowed) {
      permissionsToDelete.map((permission) => {
        if (
          permission.user.id === currentUserId &&
          permission.permissionType === PermissionType.FULL
        ) {
          isAllowed = true;
        }
      });
    }
    if (isAdmin) {
      isAllowed = true;
    }
    if (isAllowed) {
      await permissionRepo.remove(permissionsToDelete);
      const folderRepo = FolderRepo();
      await folderRepo.delete({ id: folderId });
    } else {
      throw new AccessDeniedError();
    }
  }
  async giveFolderPermission(
    userId: number,
    folderId: number,
    permissionType: PermissionType
  ) {
    const userRepo = UserRepo();
    const permissionRepo = PermissionRepo();
    const user = await userRepo.findOne({ where: { id: userId } });
    const folderRepo = FolderRepo();
    const folder = await folderRepo.findOne({ where: { id: folderId } });
    if (!folder) {
      throw new NotFoundError();
    }
    const exisPermi = await permissionRepo.findOne({
      where: {
        folder: { id: folderId },
        user: { id: userId },
      },
    });
    if (exisPermi) {
      exisPermi.permissionType = permissionType;
      await permissionRepo.save(exisPermi);
    } else {
      const permission = new PermissionModel();
      permission.user = user;
      permission.folder = folder;
      permission.permissionType = permissionType;
      await permissionRepo.save(permission);
    }
  }
}
