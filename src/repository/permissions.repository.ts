import { AppDataSource } from "../data-source";
import { PermissionModel } from "../entities/permissionModel";

export const PermissionRepo = () => {
  const permissionRepo = AppDataSource.getRepository(PermissionModel);
  return permissionRepo;
};
