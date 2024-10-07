import { validationResult } from 'express-validator';
import { Request } from 'express';
import { CustomError } from '../types/error/CustomError';

export const isValid = (req: Request) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		// 422 is validation error
		const firstError = errors.array()[0]?.msg || 'Validation Error';
		const error: CustomError = new CustomError(firstError, 422, errors.array());
		error.className = 'ValidationHandler';
		error.functionName = 'isValid';
		throw error;
	}
};

// TODO: Add more validation functions here
// import { body } from 'express-validator';

// export const validateEmail = body('email')
//     .isEmail()
//     .withMessage('Invalid email address');
