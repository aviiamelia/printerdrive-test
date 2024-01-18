import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const port = process.env.PORT;
import { routerInit } from "./routes";
const app = express();
app.use(cors());
app.use(express.json());
routerInit(app);
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
app.listen(port, () => console.log(`server Is running on port ${port}`));
