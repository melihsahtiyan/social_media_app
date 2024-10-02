import * as jwt from 'jsonwebtoken';
import Request from '../types/Request';
import { NextFunction, Response } from 'express';
import { CustomError } from '../types/error/CustomError';

const isAuth = (req: Request, res: Response, next: NextFunction) => {
	try {
		const authHeader = req.get('Authorization');

		if (!authHeader) {
			const error: CustomError = new Error('Not authenticated.');
			error.statusCode = 401;
			throw error;
		}
		// Get token from header
		const token = authHeader.split(' ')[1];

		const secretKey = process.env.SECRET_KEY;
		// Verify token
		const decodedToken = jwt.verify(token, secretKey) as { _id: string };
		// Token is invalid
		if (!decodedToken) {
			const error: CustomError = new Error('Not authenticated.');
			error.statusCode = 401;
			throw error;
		}

		// Token is valid and we have the user id
		req.userId = decodedToken._id;
		next();
	} catch (err) {
		const error: CustomError = new Error(err);
		error.statusCode = 500;
		error.message = err.message || 'Token verification failed';
		error.functionName = 'isAuth';
		res.status(error.statusCode).json({ error: error.message, statusCode: error.statusCode });
		next({ error: error.message, statusCode: error.statusCode, functionName: error.functionName, name: error.name });
	}
};

export default isAuth;
