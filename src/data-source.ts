import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "postgres",
  entities: ["src/**/**.entity{.ts,.js}"],
  migrations: ["src/database/migrations/**/*{.ts,.js}"],
  subscribers: ["src/database/subscriber/**/*{.ts,.js}"],
});
