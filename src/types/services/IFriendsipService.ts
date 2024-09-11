import { DataResult } from '../result/DataResult';
import { UserForRequestDto } from '../../models/dtos/user/user-for-request-dto';
import { Result } from '../result/Result';

export interface IFriendshipService {
	areFriends(userId: string, friendId: string): Promise<Result>;

	areFromSameUniversity(userId: string, otherUserId: string): Promise<Result>;

	getAllFriendRequests(userId: string): Promise<DataResult<Array<UserForRequestDto>>>;

	sendFriendRequest(userToFollowId: string, followingUserId: string): Promise<Result>;

	handleFriendRequest(followingUserId: string, followRequestId: string, followResponse: boolean): Promise<Result>;

	unfriend(followingUserId: string, userToUnfollowId: string): Promise<Result>;
}
