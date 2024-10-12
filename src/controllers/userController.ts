import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import Request from '../types/Request';
import { Response, NextFunction } from 'express';
import { isValid } from '../util/validationHandler';
import { Result } from '../types/result/Result';
import isAuth from '../middleware/is-auth';
import { UserForUpdate } from '../models/dtos/user/user-for-update';
import { DataResult } from '../types/result/DataResult';
import { UserDetailDto } from '../models/dtos/user/user-detail-dto';
import { UserListDto } from '../models/dtos/user/user-list-dto';
import { UserForSearchDto } from '../models/dtos/user/user-for-search-dto';
import { UserProfileDto } from '../models/dtos/user/user-profile-dto';
import { UserDoc } from '../models/schemas/user.schema';
import TYPES from '../util/ioc/types';
import IUserService from '../types/services/IUserService';

@injectable()
export class UserController {
	private readonly userService: IUserService;

	constructor(@inject(TYPES.IUserService) userService: IUserService) {
		this.userService = userService;
	}

	async viewUserProfile(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const userId: string = req.query.userId as string;

			const viewerId: string = req.userId;

			const result: DataResult<UserProfileDto | UserDetailDto> = await this.userService.viewUserProfile(
				userId,
				viewerId
			);

			return res.status(result.statusCode).json({ result });
		} catch (err) {
			next(err);
		}
	}

	async getUserByToken(req: Request, res: Response, next: NextFunction) {
		try {
			const userId: string = req.userId;
			const result: DataResult<UserProfileDto | UserDetailDto> = await this.userService.viewUserProfile(userId, userId);

			if (result.success)
				return res.status(200).json({
					message: result.message,
					data: result.data,
				});

			return res.status(result.statusCode).json({ result });
		} catch (err) {
			next(err);
		}
	}
	async getAllUsers(req: Request, res: Response, next: NextFunction) {
		try {
			const result: DataResult<Array<UserListDto>> = await this.userService.getAllUsers();

			if (result.success)
				return res.status(200).json({
					message: 'Users fetched successfully',
					data: result.data,
				});

			return res.status(result.statusCode).json({ result });
		} catch (err) {
			// console.log(err);
			next(err);
		}
	}

	async getAllDetails(req: Request, res: Response, next: NextFunction) {
		try {
			const result: DataResult<Array<UserDoc>> = await this.userService.getAllDetails();

			if (result.success)
				return res.status(200).json({
					message: 'Users fetched successfully',
					data: result.data,
				});

			return res.status(result.statusCode).json({ result });
		} catch (err) {
			next(err);
		}
	}
	async searchByName(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const name: string = req.query.name as string;
			const userId: string = req.userId;

			const result: DataResult<Array<UserForSearchDto>> = await this.userService.searchByName(name, userId);

			if (result.success)
				return res.status(200).json({
					message: result.message,
					data: result.data,
				});

			return res.status(result.statusCode).json({ result });
		} catch (err) {
			next(err);
		}
	}

	async updateProfile(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			isAuth(req, res, next);
			const userForUpdate: UserForUpdate = req.body;

			const result: Result = await this.userService.updateProfile(req.userId, userForUpdate);

			return res.status(result.statusCode).json({ result });
		} catch (err) {
			next(err);
		}
	}

	async changeProfilePhoto(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const file: Express.Multer.File = req.file;
			const userId: string = req.userId;

			const result: Result = await this.userService.changeProfilePhoto(userId, file);

			return res.status(result.statusCode).json(result);
		} catch (err) {
			next(err);
		}
	}

	async deleteProfilePhoto(req: Request, res: Response, next: NextFunction) {
		try {
			const userId: string = req.userId;

			const result: Result = await this.userService.deleteProfilePhoto(userId);

			return res.status(result.statusCode).json(result);
		} catch (err) {
			next(err);
		}
	}
}
