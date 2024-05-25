import { Express, Request, Response } from "express";
import isAuth from "../middleware/is-auth";
import * as fs from "fs";
import path from "path";

const imageMimetypes = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/webp",
  "image/heic",
  "image/gif",
];

const videoMimetypes = ["video/mp4", "video/mov", "video/avi"];

function routes(app: Express) {
  app.post("/download-media", isAuth, (req: Request, res: Response) => {
    console.log("----------------------------------------------------");
    console.log("fileController.download: started");
    const mediaUrl = req.body.mediaUrl;
    console.log("mediaUrl: ", mediaUrl);
    const file = fs.createReadStream(mediaUrl);
    const filename = new Date().toISOString();
    res.setHeader(
      "Content-Disposition",
      'attachment: filename="' + filename + '"'
    );
    file.pipe(res);
  });
}

export default routes;
