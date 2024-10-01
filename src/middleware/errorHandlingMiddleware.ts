import { NextFunction, Response } from 'express';
import Request from '../types/Request';
import { CustomError } from '../types/error/CustomError';
import logger from '../util/loggingHandler';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleError = (err: CustomError | Error, req: Request, res: Response, next: NextFunction) => {
	const customError: CustomError = err;
	const name: string = customError.name || 'Error';
	const message: string = process.env.NODE_ENV === 'development' ? customError.message : 'Something went wrong!';
	const status: number = customError?.statusCode || 500;
	const isClientError = status >= 400 && status < 500;
	const date = `${new Date(Date.now())}`;

	console.log('Error Handling Middleware: ', {
		name: name,
		error: customError,
		message: message,
	});

	logger.error({
		method: req.method,
		url: req.url,
		status,
		message: customError.message,
		date: date,
		headers: req.headers,
		params: req.params,
		query: req.query,
		user: req.userId ? req.userId : 'Anonymous', // Log user if available
	});
	return res.status(status).json({
		error: {
			name: customError.name || 'Error',
			message,
			status,
			type: isClientError ? 'Client Error' : 'Server Error',
		},
	});
};
