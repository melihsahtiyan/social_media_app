import 'reflect-metadata';
import { injectable } from 'inversify';
import mongoose from 'mongoose';
import { UserDoc, users } from '../models/schemas/user.schema';
import jwt from 'jsonwebtoken';
import IUserRepository from '../types/repositories/IUserRepository';
import { CustomError } from '../types/error/CustomError';
import { User } from '../models/entities/User';
import { UserForSearchDto } from '../models/dtos/user/user-for-search-dto';
import { UserForRequestDto } from '../models/dtos/user/user-for-request-dto';
import { ObjectId } from '../types/ObjectId';
import { RepositoryBase } from './repository-base';

@injectable()
export class UserRepository extends RepositoryBase<User> implements IUserRepository {
	constructor() {
		super(users, User);
	}

	async getUserDetails(id: string): Promise<User> {
		const user: UserDoc = await this.model.findById(id);

		return new User(user.toObject());
	}
	async getUserProfile(id: string): Promise<User> {
		const user: UserDoc = await this.model.findById(id);

		return new User(user.toObject());
	}

	async getAllByIds(ids: Array<ObjectId>): Promise<Array<User>> {
		const listedUsers: Array<UserDoc> = await this.model.find({ $in: { _id: ids } });

		if (listedUsers.length === 0) return [];
		return listedUsers.map(user => new User(user.toObject()));
	}

	async getAllPopulated(): Promise<UserDoc[]> {
		return await this.model
			.find()
			.populate('friends _id firstName lastName')
			.populate('friendRequests _id firstName lastName')
			.exec();
	}

	async getUsersByIds(userIds: string[]): Promise<Array<User>> {
		try {
			const userList = await this.model.find({
				_id: { $in: userIds },
			});

			if (userList.length === 0) return [];
			return userList.map(user => new User(user.toObject()));
		} catch (err) {
			const error: CustomError = err;
			error.className = 'UserRepository';
			error.functionName = 'getUsersByIds';
			throw error;
		}
	}

	async getById(id: string): Promise<User> {
		const result: UserDoc = await this.model.findById(id);

		if (result !== null) return new User(result.toObject());
	}

	async getByEmail(email: string): Promise<User> {
		const result: UserDoc = await this.model.findOne({ email: email });
		if (result !== null) return new User(result.toObject());
	}

	async searchByName(name: string): Promise<Array<User>> {
		const userSearchList: Array<UserDoc> = await this.model
			.aggregate()
			.addFields({ fullName: { $concat: ['$firstName', ' ', '$lastName'] } })
			.match({ fullName: { $regex: name, $options: 'i' } })
			.sort({ fullName: 1 })
			.exec();
		const result: Array<User> = userSearchList.map(user => new User(user));

		return result;
	}

	async getUsersByIdsForDetails(ids: Array<ObjectId>, detailedUser: string): Promise<Array<UserForSearchDto>> {
		const listedUsers = await this.model
			.find({ _id: { $in: ids } })
			.select('_id firstName lastName profilePhotoUrl')
			.exec();

		const detailedUserDoc: UserDoc = await this.model.findById(detailedUser);

		const usersForDetails: Array<UserForSearchDto> = listedUsers.map((user: UserDoc) => {
			const userDetail: UserForSearchDto = {
				_id: user._id,
				fullName: `${user.firstName} ${user.lastName}`,
				profilePhotoUrl: user.profilePhotoUrl,
				isFriend: user.friends.includes(detailedUserDoc._id),
			};
			return userDetail;
		});

		return usersForDetails;
	}

	async getAllFriendRequests(id: string): Promise<Array<UserForRequestDto>> {
		const user: UserDoc = await this.model.findById(id);
		const friendRequests: Array<UserForRequestDto> = await Promise.all(
			user.friendRequests.map(async requestId => {
				const request: UserDoc = await this.model.findById(requestId);
				const requestDto: UserForRequestDto = {
					_id: request._id,
					firstName: request.firstName,
					lastName: request.lastName,
					profilePhotoUrl: request.profilePhotoUrl,
				};

				return requestDto;
			})
		);

		return friendRequests;
	}

	async updateprofilePhoto(id: string, profilePhotoUrl: string): Promise<UserDoc> {
		return await this.model.findByIdAndUpdate(id, { profilePhotoUrl: profilePhotoUrl }, { new: true });
	}

	async deleteProfilePhoto(id: string): Promise<UserDoc> {
		return await this.model.findByIdAndUpdate(id, { profilePhotoUrl: null }, { new: true });
	}

	async updateStatus(id: string, { studentVerification, emailVerification }): Promise<UserDoc> {
		return await this.model.findByIdAndUpdate(
			id,
			{
				status: {
					studentVerification,
					emailVerification,
				},
			},
			{ new: true }
		);
	}

	async sendFriendRequest(userToFollowId: ObjectId, followingUserId: ObjectId): Promise<UserDoc> {
		const userToFollow: UserDoc = (await this.model.findById(userToFollowId)) as UserDoc;

		// Push the followerId to the followRequests array of the userToFollow
		userToFollow.friendRequests.push(followingUserId);
		return await userToFollow.save();
	}

	async deleteFriendRequest(receiverUserId: ObjectId, senderUserId: ObjectId): Promise<UserDoc> {
		try {
			const receiverUser: UserDoc = (await this.model.findById(receiverUserId)) as UserDoc;

			receiverUser.friendRequests = receiverUser.friendRequests.filter(
				request => request.toString() !== senderUserId.toString()
			);

			return await receiverUser.save();
		} catch (err) {
			const error: CustomError = err;
			throw error;
		}
	}

	async acceptFriendRequest(receiverUserId: ObjectId, senderUserId: ObjectId): Promise<UserDoc> {
		const receiverUser: UserDoc = await this.model.findById(receiverUserId);
		const senderUser: UserDoc = await this.model.findById(senderUserId);
		if (receiverUser.friendRequests.includes(senderUser._id)) {
			await this.deleteFriendRequest(receiverUser._id, senderUser._id);

			receiverUser.friends.push(senderUser._id as mongoose.Schema.Types.ObjectId);

			await receiverUser.save();

			senderUser.friends.push(receiverUser._id as mongoose.Schema.Types.ObjectId);
		}

		return await senderUser.save();
	}

	async rejectFriendRequest(receiverUserId: ObjectId, senderUserId: ObjectId): Promise<UserDoc> {
		const receiverUser: UserDoc = await this.model.findById(receiverUserId);
		const senderUser: UserDoc = await this.model.findById(senderUserId);

		await this.deleteFriendRequest(receiverUser._id, senderUser._id);

		return receiverUser.save();
	}

	async removeFriend(userToRemoveId: string, userId: string): Promise<UserDoc> {
		const userToRemove: UserDoc = await this.model.findById(userToRemoveId);
		const user: UserDoc = await this.model.findById(userId);

		userToRemove.friends = userToRemove.friends.filter(
			(friends: mongoose.Schema.Types.ObjectId) => friends.toString() !== user._id.toString()
		);

		user.friends = user.friends.filter(
			(friend: mongoose.Schema.Types.ObjectId) => friend.toString() !== userToRemove._id.toString()
		);

		await userToRemove.save();
		return await user.save();
	}

	async generateVerificationToken(email: string, emailType: string): Promise<string> {
		const token = jwt.sign(
			{
				email,
				emailType,
			},
			process.env.SECRET_KEY, // TODO change this to a more secure key
			{ expiresIn: '7d' }
		);

		return token;
	}
}
