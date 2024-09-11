import { ObjectId } from '../../../types/ObjectId';

export interface UserProfileDto {
	_id: ObjectId;
	firstName: string;
	lastName: string;
	email: string;
	profilePhotoUrl: string;
	university: string;
	department: string;
	friends: Array<{
		_id: string;
		firstName: string;
		lastName: string;
		profilePhotoUrl: string;
	}>;
	friendCount: number;
	friendRequests: Array<{
		_id: string;
		firstName: string;
		lastName: string;
		profilePhotoUrl: string;
	}>;
	posts: Array<ObjectId>;
	createdAt: Date;
	updatedAt: Date;
	isFriend: boolean;
}
