import { Request } from "express";

declare module "express" {
  interface Request {
    userId: string;
    files: Array<any>;
    file: any;
  }
}

export default Request;
