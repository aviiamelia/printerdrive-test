import { DataSource } from "typeorm";
import { UserModel } from "./entities/userModel";
import { Folder } from "./entities/folderModel";
import { PermissionModel } from "./entities/permissionModel";
import { FileModel } from "./entities/filesModel";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  synchronize: true,
  password: "postgres",
  database: "postgres",
  entities: [UserModel, Folder, PermissionModel, FileModel],
  migrations: ["src/database/migrations/**/*{.ts,.js}"],
  subscribers: ["src/database/subscriber/**/*{.ts,.js}"],
});
