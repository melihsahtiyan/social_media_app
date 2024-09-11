import { ObjectId } from '../../../types/ObjectId';

export interface UserListDto {
	firstName: string;
	lastName: string;
	birthDate: Date;
	email: string;
	university: string;
	department: string;
	profilePhotoUrl: string;
	friends: { _id: string; firstName: string; lastName: string }[];
	friendRequests: { _id: string; firstName: string; lastName: string }[];
	posts: ObjectId[];
}
