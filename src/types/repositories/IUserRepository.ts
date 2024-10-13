import UserForCreate from '../../models/dtos/user/user-for-create';
import { UserForUpdate } from '../../models/dtos/user/user-for-update';
import { UserDoc } from '../../models/schemas/user.schema';
import { User } from '../../models/entities/User';
import { UserListDto } from '../../models/dtos/user/user-list-dto';
import { UserForSearchDto } from '../../models/dtos/user/user-for-search-dto';
import { UserForRequestDto } from '../../models/dtos/user/user-for-request-dto';
import { ObjectId } from '../ObjectId';
import { IRepositoryBase } from './IRepositoryBase';

interface IUserRepository extends IRepositoryBase<User> {
	getUserDetails(id: string): Promise<User>;
	getUserProfile(id: string): Promise<User>;
	getAllByIds(ids: Array<ObjectId>): Promise<Array<User>>;
	getUsersByIds(userIds: string[]): Promise<Array<User>>;
	getAllPopulated(): Promise<UserDoc[]>;
	getById(id: string): Promise<User>;
	getByEmail(email: string): Promise<User>;
	getUsersByIdsForDetails(ids: Array<ObjectId>, detailedUser: string): Promise<Array<UserForSearchDto>>;
	searchByName(name: string): Promise<Array<User>>;
	getAllFriendRequests(id: string): Promise<Array<UserForRequestDto>>;
	updateStatus(id: string, { studentVerification, emailVerification }): Promise<UserDoc>;
	updateprofilePhoto(id: string, profilePhotoUrl: string): Promise<UserDoc>;
	deleteProfilePhoto(id: string): Promise<UserDoc>;

	// Friend Requests
	deleteFriendRequest(userToFollowId: ObjectId, followerId: ObjectId): Promise<UserDoc>;
	sendFriendRequest(userToFollowId: ObjectId, followingUserId: ObjectId): Promise<UserDoc>;
	acceptFriendRequest(receiverUserId: ObjectId, senderUserId: ObjectId): Promise<UserDoc>;
	rejectFriendRequest(receiverUserId: ObjectId, senderUserId: ObjectId): Promise<UserDoc>;
	removeFriend(userToUnfollowId: string, followerId: string): Promise<UserDoc>;
	generateVerificationToken(email: string, emailType: string): Promise<string>;
}

export default IUserRepository;
