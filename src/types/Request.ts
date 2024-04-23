import { Request } from "express";

declare module "express" {
  interface Request {
    userId: string;
    files: Array<Express.Multer.File>;
    file: any;
  }
}

export default Request;
