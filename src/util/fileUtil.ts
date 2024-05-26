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

const storage = multer.memoryStorage();

const profilePhotoStorage = multer.memoryStorage();

const profilePhotoFileFilter = (req: Request, file, cb: Function) => {
  const imageMimetypes: Array<string> = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/webp",
    "image/heic",
  ];

  if (imageMimetypes.find((mimetype) => mimetype === file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const fileUpload = multer({
  storage: profilePhotoStorage,
  fileFilter: profilePhotoFileFilter,
}).single("profilePhoto");

const fileFilter = (req: Request, file, cb) => {
  const imageMimetypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/webp",
    "image/heic",
    "image/gif",
  ];

  const videoMimetypes = ["video/mp4", "video/mov", "video/avi"];

  if (
    imageMimetypes.find((mimetype) => mimetype === file.mimetype) ||
    videoMimetypes.find((mimetype) => mimetype === file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const mediaUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).array("medias");

export const clearImage = (filePath: string) => {
  filePath = path.join(__dirname, "../..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
