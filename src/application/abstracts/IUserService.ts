import { UserForUpdate } from '../../models/dtos/user/user-for-update';
import { UserDetailDto } from '../../models/dtos/user/user-detail-dto';
import { UserForSearchDto } from '../../models/dtos/user/user-for-search-dto';
import { UserProfileDto } from '../../models/dtos/user/user-profile-dto';
import { User } from '../../models/entities/User';
import { UserDoc } from '../../models/schemas/user.schema';
import { DataResult } from '../../types/result/DataResult';
import { Result } from '../../types/result/Result';

interface IUserService {
	getAllUsers(): Promise<DataResult<Array<User>>>;

	getAllDetails(): Promise<DataResult<Array<UserDoc>>>;

	getUserById(userId: string): Promise<DataResult<User>>;
	getUsersByIds(userIds: Array<string>): Promise<DataResult<Array<User>>>;

	viewUserProfile(userId: string, viewerId: string): Promise<DataResult<UserProfileDto | UserDetailDto>>;

	searchByName(name: string, userId: string): Promise<DataResult<Array<UserForSearchDto>>>;

	updateProfile(userId: string, userForUpdate: UserForUpdate): Promise<Result>;

	changeProfilePhoto(userId: string, file: Express.Multer.File): Promise<Result>;

	deleteProfilePhoto(userId: string): Promise<Result>;
}

export default IUserService;
