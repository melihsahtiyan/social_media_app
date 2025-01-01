import { UserDoc } from '../../models/schemas/user.schema';
import { User } from '../../models/entities/User';
import { UserForRequestDto } from '../../models/dtos/user/user-for-request-dto';
import { ObjectId } from '../../types/ObjectId';
import { IRepositoryBase } from './IRepositoryBase';

interface IUserRepository extends IRepositoryBase<User> {
	getUsersByIds(userIds: string[]): Promise<Array<User>>;
	getAllPopulated(): Promise<UserDoc[]>;
	getById(id: string): Promise<User>;
	getByEmail(email: string): Promise<User>;
	searchByName(name: string): Promise<Array<User>>;
	getAllFriendRequests(id: string): Promise<Array<UserForRequestDto>>;
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
