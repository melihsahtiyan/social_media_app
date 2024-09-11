import { ObjectId } from '../../../types/ObjectId';

export interface UserDetailDto {
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
	}>;
	friendCount: number;
	createdAt: Date;
	updatedAt: Date;
	isFriend: boolean;
}
