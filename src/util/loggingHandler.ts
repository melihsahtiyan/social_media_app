import { NextFunction, Response } from "express";
import winston from "winston";
import Request from "../types/Request";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({
      filename: "combined.log",
      level: "info",
      format: winston.format.simple(),
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "exceptions.log" }),
  ],
});

export default logger;

export const logRequest = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Path: ${req.originalUrl}
  Method: ${req.method}
  IP: ${req.ip}
  Header: ${req.headers["user-agent"]}
  Body: ${JSON.stringify(req.body)}
  Form Data: ${
    req.file
      ? JSON.stringify(req.files.map((file) => file.filename))
      : "No files"
  }
  Query: ${JSON.stringify(req.query)}
  Params: ${JSON.stringify(req.params)}
  Request received at ${new Date().toISOString()}
-----------------------------------------------------------`);
  next();
};
