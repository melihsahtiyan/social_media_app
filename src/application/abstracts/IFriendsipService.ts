import { UserForRequestDto } from '../../models/dtos/user/user-for-request-dto';
import { DataResult } from '../../types/result/DataResult';
import { Result } from '../../types/result/Result';

export interface IFriendshipService {
	areFriends(userId: string, friendId: string): Promise<Result>;

	areFromSameUniversity(userId: string, otherUserId: string): Promise<Result>;

	getAllFriendRequests(userId: string): Promise<DataResult<Array<UserForRequestDto>>>;

	sendFriendRequest(userToFollowId: string, followingUserId: string): Promise<Result>;

	handleFriendRequest(followingUserId: string, followRequestId: string, followResponse: boolean): Promise<Result>;

	unfriend(followingUserId: string, userToUnfollowId: string): Promise<Result>;
}
