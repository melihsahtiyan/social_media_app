import 'reflect-metadata';
import { inject } from 'inversify';
import { controller } from 'inversify-express-utils';
import { NextFunction, Response } from 'express';
import Request from './../../types/Request';
import { Result } from './../../types/result/Result';
import { DataResult } from './../../types/result/DataResult';
import UserForRegister from './../../models/dtos/user/user-for-register';
import UserForLogin from './../../models/dtos/user/user-for-login';
import { UserLoginResponse } from '../../models/dtos/user/user-login-response';
import { isValid } from './../../util/validationHandler';
import { ServiceIdentifiers } from '../../application/constants/ServiceIdentifiers';
import IAuthService from '../../application/abstracts/IAuthService';

@controller('/auth')
export class AuthController {
	private _authService: IAuthService;

	constructor(@inject(ServiceIdentifiers.IAuthService) authService: IAuthService) {
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
