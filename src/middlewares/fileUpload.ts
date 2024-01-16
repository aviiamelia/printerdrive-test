// src/middlewares/fileUpload.ts
import multer, { diskStorage } from "multer";
import { Request } from "express";

const storage = diskStorage({
  destination: function (req: Request, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req: Request, file, cb) {
    const uniqueSuffix =
      new Date().toISOString().replace(/:/g, "-") +
      "-" +
      Math.round(Math.random() * 1e9);
    console.log(uniqueSuffix, "*************************");
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

export { upload };
