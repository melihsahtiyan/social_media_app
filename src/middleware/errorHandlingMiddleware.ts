import { NextFunction, Request, Response } from "express";
import { CustomError } from "../types/error/CustomError";

export const handleError = (
  error: CustomError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customError: CustomError = error;

  const status: number = customError.statusCode || 500;

  res.status(status).json({ error: customError });
};
