import { NextFunction, Request, Response } from "express";
import { CustomError } from "../types/error/CustomError";
import logger from "../util/loggingHandler";

export const handleError = (
  error: CustomError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customError: CustomError = error;

  const status: number = customError.statusCode || 500;

  logger.error(
    `${req.method} ${req.url} ${status} ${customError.message} ${customError.data}`
  );

  res.status(status).json({ error: customError });
};
