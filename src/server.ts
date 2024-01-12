import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";

const app = express();
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
app.listen(5000, () => console.log("server is is not running"));

app.get("/", (req, res) => {
  res.send("hello world");
});
