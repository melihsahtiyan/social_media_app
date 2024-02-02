import { NextFunction, Request, Response } from "express";
import { CustomError } from "../types/error/CustomError";

export const handleError = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(error);

  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({ message, data, status });
};
