import { DataSource } from "typeorm";
import { UserModel } from "./entities/userModel";
import { Folder } from "./entities/folderModel";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  synchronize: true,
  password: "postgres",
  database: "postgres",
  entities: [UserModel, Folder],
  migrations: ["src/database/migrations/**/*{.ts,.js}"],
  subscribers: ["src/database/subscriber/**/*{.ts,.js}"],
});
