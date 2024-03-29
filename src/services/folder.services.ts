import { BcryptAdapter } from "../adapters/bcrypt.adapter";
import { Folder } from "../entities/folderModel";
import { FolderRepo } from "../repository/folder.repository";
import { UserRepo } from "../repository/user.repository";
import { UserModel } from "../entities/userModel";
import { PermissionRepo } from "../repository/permissions.repository";
import { PermissionModel, PermissionType } from "../entities/permissionModel";
import { AccessDeniedError } from "../errorHandler/accessDeniedError";
import { NotFoundError } from "../errorHandler/notFoundError";
import { FileRepo } from "../repository/file.repositoru";
import { FileModel } from "../entities/filesModel";

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
      const subFolder = folderRepo.create({
        folderName: folderName,
        user: user as UserModel,
      });
      subFolder.user = user;
      const parentFolder = await folderRepo.findOne({
        where: { id: parentFolderId },
      });
      folderRepo.save(subFolder);
      permission.user = user;
      permission.folder = subFolder;
      permission.permissionType = PermissionType.FULL;
      subFolder.folderName = folderName;
      subFolder.parentFolder = parentFolder;
      await permissionRepo.save(permission);
      return subFolder;
    }
  }
  async uploadFile(
    foldId: number,
    currentUserId: number,
    isAdmin: boolean,
    uploadedFiles: Express.Multer.File[]
  ) {
    const folderRepo = FolderRepo();
    const fileRepo = FileRepo();
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
      for (const uploadedFile of uploadedFiles) {
        const file = new FileModel();
        file.fileName = uploadedFile.originalname;
        file.filePath = "uploads/" + uploadedFile.originalname; // Replace with your actual saving logic
        file.folder = folder;

        await fileRepo.save(file);
      }
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
  async downloadFolder(folderId: number) {
    const fileRepo = FileRepo();
    const folderRepo = FolderRepo();
    const folder = await folderRepo.findOne({
      where: { id: folderId },
      relations: ["files"],
    });
    const files = await fileRepo.find({ where: { folder: { id: folderId } } });
    const zipFileName = folder.folderName;
    return { files, zipFileName };
  }
  async listFolders(userId: number) {
    const folderRepo = FolderRepo();
    const folders = await folderRepo.find({
      where: {
        permissions: { user: { id: userId }, folder: { user: { id: userId } } },
      },
      relations: ["files", "childFolders"],
    });
    folders.map((folder) => {
      folder.childFolders.map((child) => {
        const found = folders.find((fold) => fold.id === child.id);
        if (found) {
          const index = folders.indexOf(found);
          folders.splice(index, 1);
        }
      });
    });
    return folders;
  }
  async listSharedFolders(userId: number) {
    const folderRepo = FolderRepo();
    const permissionRepo = PermissionRepo();

    const folders = await folderRepo
      .createQueryBuilder("folder")
      .leftJoinAndSelect("folder.user", "user")
      .leftJoin("folder.permissions", "permission")
      .andWhere("folder.user.id != :id", { id: userId })
      .andWhere("permission.user.id = :id", { id: userId })
      .getMany();

    return folders;
  }
  async updateFolder(
    folderId: number,
    newFolderName: string,
    currentUserId: number,
    isAdmin: boolean
  ) {
    const folderRepo = FolderRepo();
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
      const folder = await folderRepo.findOne({ where: { id: folderId } });
      folder.folderName = newFolderName;
      folderRepo.save(folder);
      return folder;
    } else {
      throw new AccessDeniedError();
    }
  }
}
