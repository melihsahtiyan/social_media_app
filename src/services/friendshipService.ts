import 'reflect-metadata';
import { Result } from '../types/result/Result';
import { IFriendshipService } from '../types/services/IFriendsipService';
import { inject, injectable } from 'inversify';
import { User } from '../models/entities/User';
import { CustomError } from '../types/error/CustomError';
import { UserForRequestDto } from '../models/dtos/user/user-for-request-dto';
import { DataResult } from '../types/result/DataResult';
import IUserRepository from "../types/repositories/IUserRepository";
import TYPES from "../util/ioc/types";

@injectable()
export class FriendshipService implements IFriendshipService {
	private readonly userRepository: IUserRepository;
	constructor(@inject(TYPES.IUserRepository) userRepository: IUserRepository) {
		this.userRepository = userRepository;
	}
	async areFriends(userId: string, friendId: string): Promise<Result> {
		try {
			const user: User = await this.userRepository.getById(userId);
			const friend: User = await this.userRepository.getById(friendId);

			if (!user || !friend) {
				return { statusCode: 404, message: 'User not found!', success: false };
			}

			const areFriends: boolean = user.isFriend(friend._id) && friend.isFriend(user._id);

			return {
				statusCode: 200,
				message: areFriends ? 'Users are friends!' : 'Users are not friends!',
				success: areFriends,
			};
		} catch (err) {
			const error: CustomError = new Error(err);
			error.statusCode = err?.statusCode || 500;

			throw err;
		}
	}
	async areFromSameUniversity(userId: string, otherUserId: string): Promise<Result> {
		try {
			const user: User = await this.userRepository.getById(userId);
			const otherUser: User = await this.userRepository.getById(otherUserId);

			if (!user || !otherUser) {
				return { statusCode: 404, message: 'User not found!', success: false };
			}

			const areFromSameUniversity: boolean = user.university === otherUser.university;

			return {
				statusCode: 200,
				message: areFromSameUniversity
					? 'Users are from the same university!'
					: 'Users are not from the same university!',
				success: areFromSameUniversity,
			};
		} catch (err) {
			const error: CustomError = new Error(err);
			error.statusCode = err?.statusCode || 500;

			throw err;
		}
	}

	async getAllFriendRequests(userId: string): Promise<DataResult<UserForRequestDto[]>> {
		try {
			const user: User = await this.userRepository.getById(userId);

			if (!user) {
				const result: DataResult<UserForRequestDto[]> = {
					statusCode: 404,
					message: 'You must be logged in!',
					success: false,
					data: null,
				};
				return result;
			}

			const friendRequests: UserForRequestDto[] = await this.userRepository.getAllFriendRequests(user.getId());

			const result: DataResult<UserForRequestDto[]> = {
				statusCode: 200,
				message: 'Friend requests fetched successfully',
				success: true,
				data: friendRequests,
			};

			return result;
		} catch (err) {
			const error: CustomError = new Error(err);
			error.statusCode = err?.statusCode || 500;

			throw err;
		}
	}
	async sendFriendRequest(userToFollowId: string, followingUserId: string): Promise<Result> {
		try {
			if (userToFollowId === followingUserId) {
				const errorResult: Result = {
					statusCode: 400,
					message: 'You cannot be Friend of yourself!',
					success: false,
				};
				return errorResult;
			}

			const followingUser: User = await this.userRepository.getById(followingUserId);

			if (!followingUser) {
				const result: Result = {
					statusCode: 404,
					message: 'You must be logged in!',
					success: false,
				};

				return result;
			}

			const userToFollow: User = await this.userRepository.getById(userToFollowId);

			if (!userToFollow) {
				const result: Result = {
					statusCode: 404,
					message: 'User to Friend not found!',
					success: false,
				};
				return result;
			}

			if (
				// Check if the user is already following the user
				followingUser.isFriend(userToFollow._id)
			) {
				const result: Result = {
					statusCode: 400,
					message: 'You are already friends!',
					success: false,
				};
				return result;
			}
			// Check if the user has already sent a follow request
			if (userToFollow.hasFriendRequest(followingUser._id)) {
				// If yes, cancel the follow request
				await this.userRepository.deleteFriendRequest(userToFollow._id, followingUser._id);

				const result: Result = {
					statusCode: 200,
					message: 'Friend request cancelled!',
					success: true,
				};
				return result;
			} else {
				// If not, send a follow request

				await this.userRepository.sendFriendRequest(userToFollow._id, followingUser._id);

				const result: Result = {
					statusCode: 200,
					message: 'Friend request sent!',
					success: true,
				};
				return result;
			}
		} catch (err) {
			const error: CustomError = new Error(err);
			error.statusCode = err?.statusCode || 500;

			throw err;
		}
	}

	async handleFriendRequest(receiverUserId: string, senderUserId: string, response: boolean): Promise<Result> {
		try {
			const receiverUser: User = await this.userRepository.getById(receiverUserId);

			if (!receiverUser) {
				const result: Result = {
					statusCode: 404,
					message: 'You must be logged in!',
					success: false,
				};
				return result;
			}

			const senderUser: User = await this.userRepository.getById(senderUserId);

			// Check 1: if the user to follow exists
			if (!senderUser) {
				const result: Result = {
					statusCode: 404,
					message: 'User not found!',
					success: false,
				};
				return result;
			}

			// Check 2: if the user has already following user to follow
			if (receiverUser.isFriend(senderUser._id) && senderUser.isFriend(receiverUser._id)) {
				const result: Result = {
					statusCode: 400,
					message: 'You are already friends!',
					success: false,
				};
				return result;
			}

			// Check 3: if the user has a follow request from the follower user
			if (!receiverUser.hasFriendRequest(senderUser._id)) {
				const result: Result = {
					statusCode: 404,
					message: 'No follow request found!',
					success: false,
				};
				return result;
			}

			// Handle the follow request
			// Possible cases: Accept or Decline
			if (response) {
				// 1st case: Accept the follow request

				await this.userRepository.acceptFriendRequest(receiverUser._id, senderUser._id);
				const result: Result = {
					statusCode: 200,
					message: 'Friend request accepted!',
					success: true,
				};
				return result;
			} else {
				// 2nd case: Decline the follow request
				await this.userRepository.rejectFriendRequest(receiverUser._id, senderUser._id);

				const result: Result = {
					statusCode: 200,
					message: 'Friend request rejected!',
					success: true,
				};
				return result;
			}
		} catch (err) {
			const error: CustomError = new Error(err);
			error.statusCode = err?.statusCode || 500;

			throw err;
		}
	}
	async unfriend(followingUserId: string, userToUnfollowId: string): Promise<Result> {
		try {
			const followingUser: User = await this.userRepository.getById(followingUserId);
			const userToUnfollow: User = await this.userRepository.getById(userToUnfollowId);

			// Check 1: if the user exists
			if (!followingUser || !userToUnfollow) {
				const result: Result = {
					statusCode: 404,
					message: 'User not found!',
					success: false,
				};
				return result;
			}

			// Check 2: if the user is friend with the user to unfollow
			if (!followingUser.isFriend(userToUnfollow._id) && !userToUnfollow.isFriend(followingUser._id)) {
				const result: Result = {
					statusCode: 400,
					message: 'You are not friends!',
					success: false,
				};
				return result;
			}

			// Unfriend the user
			await this.userRepository.removeFriend(userToUnfollow.getId(), followingUser.getId());

			const result: Result = {
				statusCode: 200,
				message: 'User unfriended!',
				success: true,
			};

			return result;
		} catch (err) {
			const error: CustomError = new Error(err);
			error.statusCode = err?.statusCode || 500;

			throw err;
		}
	}
}
