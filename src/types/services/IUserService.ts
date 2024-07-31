import { DataResult } from '../result/DataResult';
import { Result } from './../result/Result';
import { UserForUpdate } from '../../models/dtos/user/user-for-update';
import { UserDetailDto } from '../../models/dtos/user/user-detail-dto';
import { UserListDto } from '../../models/dtos/user/user-list-dto';
import { UserForSearchDto } from '../../models/dtos/user/user-for-search-dto';
import { UserProfileDto } from '../../models/dtos/user/user-profile-dto';
import { UserForRequestDto } from '../../models/dtos/user/user-for-request-dto';
import { User } from '../../models/entites/User';

interface IUserService {
	getAllUsers(): Promise<DataResult<Array<UserListDto>>>;

	getAllDetails(): Promise<DataResult<Array<UserProfileDto>>>;

	getUserById(userId: string): Promise<DataResult<User>>;

	viewUserDetails(userId: string, viewerId: string): Promise<DataResult<UserDetailDto>>;

	viewUserProfile(userId: string, viewerId: string): Promise<DataResult<UserProfileDto | UserDetailDto>>;

	searchByName(name: string, userId: string): Promise<DataResult<Array<UserForSearchDto>>>;

	getAllFriendRequests(userId: string): Promise<DataResult<Array<UserForRequestDto>>>;

	updateProfile(userId: string, userForUpdate: UserForUpdate): Promise<Result>;

	changeProfilePhoto(userId: string, file: Express.Multer.File): Promise<Result>;
	sendFriendRequest(followingUserId: string, userToFollowId: string): Promise<Result>;

	handleFriendRequest(followingUserId: string, followRequestId: string, followResponse: boolean): Promise<Result>;

	unfriend(followingUserId: string, userToUnfollowId: string): Promise<Result>;

	deleteProfilePhoto(userId: string): Promise<Result>;
}

export default IUserService;
