import mongoose from 'mongoose';
import UserForCreate from '../../models/dtos/user/user-for-create';
import { UserForUpdate } from '../../models/dtos/user/user-for-update';
import { UserDoc } from '../../models/schemas/user.schema';
import { User } from '../../models/entities/User';
import { UserListDto } from '../../models/dtos/user/user-list-dto';
import { UserForSearchDto } from '../../models/dtos/user/user-for-search-dto';
import { UserForRequestDto } from '../../models/dtos/user/user-for-request-dto';
import { ObjectId } from '../ObjectId';

interface IUserRepository {
	create(userForCreate: UserForCreate): Promise<UserDoc>;
	getUserDetails(id: string): Promise<User>;
	getUserProfile(id: string): Promise<User>;
	getAll(filter: Partial<User>): Promise<Array<UserListDto>>;
	getAllByIds(ids: Array<ObjectId>): Promise<Array<User>>;
	getUsersByIds(userIds: string[]): Promise<Array<User>>;
	getAllPopulated(): Promise<UserDoc[]>;
	getById(id: string): Promise<User>;
	getByEmail(email: string): Promise<User>;
	getUsersByIdsForDetails(
		ids: Array<mongoose.Schema.Types.ObjectId>,
		detailedUser: string
	): Promise<Array<UserForSearchDto>>;
	searchByName(name: string): Promise<Array<User>>;
	getAllFriendRequests(id: string): Promise<Array<UserForRequestDto>>;
	update(id: string, user: UserForUpdate): Promise<UserDoc>;
	updateStatus(id: string, { studentVerification, emailVerification }): Promise<UserDoc>;
	updateprofilePhoto(id: string, profilePhotoUrl: string): Promise<UserDoc>;
	deleteProfilePhoto(id: string): Promise<UserDoc>;
	delete(id: string): Promise<UserDoc>;

	deleteFriendRequest(
		userToFollowId: mongoose.Schema.Types.ObjectId,
		followerId: mongoose.Schema.Types.ObjectId
	): Promise<UserDoc>;
	acceptFriendRequest(userToFollow: UserDoc, followerUser: UserDoc): Promise<UserDoc>;
	rejectFriendRequest(userToFollow: UserDoc, followerUser: UserDoc): Promise<UserDoc>;
	removeFriend(userToUnfollowId: string, followerId: string): Promise<UserDoc>;
	generateVerificationToken(email: string, emailType: string): Promise<string>;
}

export default IUserRepository;
