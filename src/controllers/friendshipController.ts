import { inject, injectable } from 'inversify';
import { FriendshipService } from '../services/friendshipService';
import { NextFunction, Response } from 'express';
import { Result } from '../types/result/Result';
import { isValid } from '../util/validationHandler';
import Request from '../types/Request';
import { DataResult } from '../types/result/DataResult';
import { UserForRequestDto } from '../models/dtos/user/user-for-request-dto';

@injectable()
export class FriendshipController {
	private readonly friendshipService: FriendshipService;
	constructor(@inject(FriendshipService) friendshipService: FriendshipService) {
		this.friendshipService = friendshipService;
	}

	async getAllFriendRequests(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const userId: string = req.userId;

			const result: DataResult<Array<UserForRequestDto>> = await this.friendshipService.getAllFriendRequests(userId);

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

	async sendFriendRequest(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const userToFollow: string = req.body.userId;
			const followingUser: string = req.userId;

			const result: Result = await this.friendshipService.sendFriendRequest(userToFollow, followingUser);

			if (result.success)
				return res.status(200).json({
					message: result.message,
				});

			return res.status(result.statusCode).json({ result });
		} catch (err) {
			console.log(err);
			next(err);
		}
	}

	async handleFollowRequest(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const receiverUserId: string = req.userId;
			const senderUserId: string = req.body.userId;
			const response: boolean = req.body.response;

			const result: Result = await this.friendshipService.handleFriendRequest(receiverUserId, senderUserId, response);

			if (result.success)
				return res.status(200).json({
					message: result.message,
				});

			return res.status(result.statusCode).json({ result });
		} catch (err) {
			console.log(err);
			next(err);
		}
	}

	async unfriendUser(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const userId: string = req.userId;
			const friendId: string = req.params.friendId;

			const result: Result = await this.friendshipService.unfriend(userId, friendId);

			return res.status(result.statusCode).json({ result });
		} catch (err) {
			console.log(err);
			next(err);
		}
	}
}
