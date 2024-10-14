import { Dto } from '../Dto';
import { ObjectId } from '../../../types/ObjectId';
import { UserForRequestDto } from './user-for-request-dto';

export interface UserProfileDto extends Dto {
	_id: ObjectId;
	firstName: string;
	lastName: string;
	email: string;
	profilePhotoUrl: string;
	university: string;
	department: string;
	friends: Array<UserForRequestDto>;
	friendCount: number;
	friendRequests: Array<UserForRequestDto>;
	posts: Array<ObjectId>;
	totalLikes: number;
	createdAt: Date;
	updatedAt: Date;
	isFriend: boolean;
}
