import { NextFunction, Response } from 'express';
import winston from 'winston';
import Request from '../types/Request';

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.json(),
	transports: [
		new winston.transports.Console({
			format: winston.format.combine(winston.format.colorize(), winston.format.simple())
		}),
		new winston.transports.File({
			filename: './logs/error.log',
			level: 'error'
		}),
		new winston.transports.File({
			filename: './logs/combined.log',
			level: 'info',
			format: winston.format.simple()
		})
	],
	exceptionHandlers: [new winston.transports.File({ filename: './logs/exceptions.log' })]
});

export default logger;

export const logRequest = (req: Request, res: Response, next: NextFunction) => {
	logger.info(`Path: ${req.originalUrl}
  Method: ${req.method}
  IP: ${req.ip}
  Header: ${req.headers['user-agent']}
  Body: ${JSON.stringify(req.body)}
  Form Data: ${req.files ? req.files.map((file) => file.filename) : req.file ? req.file.filename : ''}
  Query: ${JSON.stringify(req.query)}
  Params: ${JSON.stringify(req.params)}
  Request received at ${new Date().toISOString()}
-----------------------------------------------------------`);
	next();
};

export const authRequestLogger = (req: Request, res: Response, next: NextFunction) => {
	logger.info(`Path: ${req.path}
  Method: ${req.method}
  IP: ${req.ip}
  Request received at ${new Date().toISOString()}
  ---------------------------------------------------------`);
	next();
};
