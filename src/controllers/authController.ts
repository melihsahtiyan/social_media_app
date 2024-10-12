import 'reflect-metadata';
import { inject } from 'inversify';
import { controller } from 'inversify-express-utils';
import Request from './../types/Request';
import { NextFunction, Response } from 'express';
import { isValid } from './../util/validationHandler';
import UserForRegister from './../models/dtos/user/user-for-register';
import { Result } from './../types/result/Result';
import UserForLogin from './../models/dtos/user/user-for-login';
import { DataResult } from './../types/result/DataResult';
import { UserLoginResponse } from '../models/dtos/user/user-login-response';
import IAuthService from '../types/services/IAuthService';
import TYPES from '../util/ioc/types';

@controller('/auth')
export class AuthController {
	private _authService: IAuthService;

	constructor(@inject(TYPES.IAuthService) authService: IAuthService) {
		this._authService = authService;
	}

	async register(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const userToRegister: UserForRegister = req.body;

			const result: Result = await this._authService.register(userToRegister);

			return res.status(result.statusCode).json({ result });
		} catch (err) {
			next(err);
		}
	}

	async login(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const userToLogin: UserForLogin = req.body;

			const result: DataResult<UserLoginResponse> = await this._authService.login(userToLogin);

			return res.status(result.statusCode).json({ result });
		} catch (err) {
			next(err);
		}
	}

	async verifyEmail(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const email: string = req.body.email;
			const verificationToken: string = req.body.verificationToken;

			const result: Result = await this._authService.verifyEmail(email, verificationToken);

			return res.status(result.statusCode).json({ result });
		} catch (err) {
			next(err);
		}
	}
}
