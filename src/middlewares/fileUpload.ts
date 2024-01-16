import multer from "multer";

// Specify the destination folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the folder where you want to save the files
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Specify the file name
    cb(null, file.originalname);
  },
});

// Use the storage configuration
const upload = multer({ storage: storage });

export { upload };
