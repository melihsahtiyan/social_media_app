import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import Request from "../types/Request";

const mimeTypes = {
  "image/png": ".png",
  "image/jpg": ".jpg",
  "image/jpeg": ".jpeg",
  "image/webp": ".webp",
  "image/heic": ".heic",
  "image/gif": ".gif",
  "video/mp4": ".mp4",
  "video/mov": ".mov",
  "video/avi": ".avi",
};

const profilePictureStorage = multer.diskStorage({
  destination: function (req: Request, file, cb: Function) {
    cb(null, "media/profilePictures");
  },
  filename: function (req: Request, file, cb: Function) {
    const uniqueSuffix = uuidv4() + "-" + Math.round(Math.random() * 1e9);
    const mimeType = mimeTypes[file.mimetype];
    cb(null, uniqueSuffix + mimeType);
  },
});

const profilePictureFileFilter = (req: Request, file, cb: Function) => {
  const imageMimetypes: Array<string> = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/webp",
    "image/heic",
    "image/gif",
  ];

  if (imageMimetypes.find((mimetype) => mimetype === file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const fileUpload = multer({
  storage: profilePictureStorage,
  fileFilter: profilePictureFileFilter,
}).single("profilePicture");

export const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
