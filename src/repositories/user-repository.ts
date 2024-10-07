import 'reflect-metadata';
import { injectable } from 'inversify';
import mongoose from 'mongoose';
import { UserDoc, users } from '../models/schemas/user.schema';
import UserForCreate from '../models/dtos/user/user-for-create';
import { UserForUpdate } from '../models/dtos/user/user-for-update';
import jwt from 'jsonwebtoken';
import IUserRepository from '../types/repositories/IUserRepository';
import { CustomError } from '../types/error/CustomError';
import { User } from '../models/entities/User';
import { UserListDto } from '../models/dtos/user/user-list-dto';
import { UserForSearchDto } from '../models/dtos/user/user-for-search-dto';
import { UserForRequestDto } from '../models/dtos/user/user-for-request-dto';
import { ObjectId } from '../types/ObjectId';

@injectable()
export class UserRepository implements IUserRepository {
	constructor() {}

	async create(userForCreate: UserForCreate): Promise<UserDoc> {
		return await users.create({
			...userForCreate,
			friends: [],
			following: [],
			posts: [],
		});
	}

	async getUserDetails(id: string): Promise<User> {
		const user: UserDoc = await users.findById(id);

		return new User(user.toObject());
	}
	async getUserProfile(id: string): Promise<User> {
		const user: UserDoc = await users.findById(id);

		return new User(user.toObject());
	}

	async getAll(filter?: Partial<User>): Promise<Array<UserListDto>> {
		return (await users
			.find(filter)
			.populate('friends', '_id firstName lastName')
			.populate('friendRequests', '_id firstName lastName')) as Array<UserListDto>;
	}

	async getAllByIds(ids: Array<ObjectId>): Promise<Array<User>> {
		const listedUsers: Array<UserDoc> = await users.find({ $in: { _id: ids } });

		if (listedUsers.length === 0) return [];
		return listedUsers.map(user => new User(user.toObject()));
	}

	async getAllPopulated(): Promise<UserDoc[]> {
		return await users
			.find()
			.populate('friends _id firstName lastName')
			.populate('friendRequests _id firstName lastName')
			.exec();
	}

	async getUsersByIds(userIds: string[]): Promise<Array<User>> {
		try {
			const userList = await users.find({
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
		const result: UserDoc = await users.findById(id);

		if (result !== null) return new User(result.toObject());
	}

	async getByEmail(email: string): Promise<User> {
		const result: UserDoc = await users.findOne({ email: email });
		if (result !== null) return new User(result.toObject());
	}

	async searchByName(name: string): Promise<Array<User>> {
		const userSearchList: Array<UserDoc> = await users
			.aggregate()
			.addFields({ fullName: { $concat: ['$firstName', ' ', '$lastName'] } })
			.match({ fullName: { $regex: name, $options: 'i' } })
			.sort({ fullName: 1 })
			.exec();
		const result: Array<User> = userSearchList.map(user => new User(user));

		return result;
	}

	async getUsersByIdsForDetails(
		ids: Array<mongoose.Schema.Types.ObjectId>,
		detailedUser: string
	): Promise<Array<UserForSearchDto>> {
		const listedUsers = await users
			.find({ _id: { $in: ids } })
			.select('_id firstName lastName profilePhotoUrl')
			.exec();

		const detailedUserDoc: UserDoc = await users.findById(detailedUser);

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
		const user: UserDoc = await users.findById(id);
		const friendRequests: Array<UserForRequestDto> = await Promise.all(
			user.friendRequests.map(async requestId => {
				const request: UserDoc = await users.findById(requestId);
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

	async update(id: string, user: UserForUpdate): Promise<UserDoc> {
		return await users.findByIdAndUpdate(id, { ...user }, { new: true });
	}

	async updateprofilePhoto(id: string, profilePhotoUrl: string): Promise<UserDoc> {
		return await users.findByIdAndUpdate(id, { profilePhotoUrl: profilePhotoUrl }, { new: true });
	}

	async deleteProfilePhoto(id: string): Promise<UserDoc> {
		return await users.findByIdAndUpdate(id, { profilePhotoUrl: null }, { new: true });
	}

	async updateStatus(id: string, { studentVerification, emailVerification }): Promise<UserDoc> {
		return await users.findByIdAndUpdate(
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

	async delete(id: string): Promise<UserDoc> {
		return await users.findByIdAndDelete(id);
	}

	async sendFriendRequest(
		userToFollowId: mongoose.Schema.Types.ObjectId,
		followingUserId: mongoose.Schema.Types.ObjectId
	): Promise<UserDoc> {
		const userToFollow: UserDoc = (await users.findById(userToFollowId)) as UserDoc;

		// Push the followerId to the followRequests array of the userToFollow
		userToFollow.friendRequests.push(followingUserId);
		return await userToFollow.save();
	}

	async deleteFriendRequest(
		receiverUserId: mongoose.Schema.Types.ObjectId,
		senderUserId: mongoose.Schema.Types.ObjectId
	): Promise<UserDoc> {
		try {
			const receiverUser: UserDoc = (await users.findById(receiverUserId)) as UserDoc;

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
		const receiverUser: UserDoc = await users.findById(receiverUserId);
		const senderUser: UserDoc = await users.findById(senderUserId);
		if (receiverUser.friendRequests.includes(senderUser._id)) {
			await this.deleteFriendRequest(receiverUser._id, senderUser._id);

			receiverUser.friends.push(senderUser._id as mongoose.Schema.Types.ObjectId);

			await receiverUser.save();

			senderUser.friends.push(receiverUser._id as mongoose.Schema.Types.ObjectId);
		}

		return await senderUser.save();
	}

	async rejectFriendRequest(receiverUserId: ObjectId, senderUserId: ObjectId): Promise<UserDoc> {
		const receiverUser: UserDoc = await users.findById(receiverUserId);
		const senderUser: UserDoc = await users.findById(senderUserId);

		await this.deleteFriendRequest(receiverUser._id, senderUser._id);

		return receiverUser.save();
	}

	async removeFriend(userToRemoveId: string, userId: string): Promise<UserDoc> {
		const userToRemove: UserDoc = await users.findById(userToRemoveId);
		const user: UserDoc = await users.findById(userId);

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
