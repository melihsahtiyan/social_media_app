import 'reflect-metadata';
import { inject, injectable } 		from 'inversify';
import { NextFunction, Response } 	from 'express';
import { isValid } 					from '../../util/validationHandler';
import Request 						from '../../types/Request';
import { Result } 					from '../../types/result/Result';
import { DataResult } 				from '../../types/result/DataResult';
import { UserForRequestDto } 		from '../../models/dtos/user/user-for-request-dto';
import { ServiceIdentifiers } 		from '../../application/constants/ServiceIdentifiers';
import { IFriendshipService } from '../../application/abstracts/IFriendsipService';

@injectable()
export class FriendshipController {
	private readonly friendshipService: IFriendshipService;
	constructor(@inject(ServiceIdentifiers.IFriendshipService) friendshipService: IFriendshipService) {
		this.friendshipService = friendshipService;
	}

	async getAllFriendRequests(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const userId: string = req.userId;

			const result: DataResult<Array<UserForRequestDto>> = await this.friendshipService.getAllFriendRequests(userId);

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

			return res.status(result.statusCode).json({ result });
		} catch (err) {
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

			return res.status(result.statusCode).json({ result });
		} catch (err) {
			console.error(err);
			next(err);
		}
	}

	async unfriendUser(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const userId: string = req.userId;
			const friendId: string = req.query.userId as string;

			const result: Result = await this.friendshipService.unfriend(userId, friendId);

			return res.status(result.statusCode).json({ result });
		} catch (err) {
			console.error(err);
			next(err);
		}
	}
}
