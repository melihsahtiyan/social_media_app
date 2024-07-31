import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../types/error/CustomError';
import logger from '../util/loggingHandler';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleError = (err: CustomError | Error, req: Request, res: Response, next: NextFunction) => {
	const customError: CustomError = err;
	const name: string = customError.name || 'Error';
	const message: string = customError.message || 'An error occurred!';
	const status: number = customError.statusCode || 500;
	const date = `${new Date(Date.now())}`;

	console.log('Error Handling Middleware: ', {
		name: name,
		error: customError,
		message: message
	});

	logger.error(`${req.method} ${req.url} ${status} ${customError.message} ${customError.data} ${date}`);

	return res.status(status).json({ name: name, error: customError, message: message });
};
