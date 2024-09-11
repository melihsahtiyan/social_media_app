import { ObjectId } from '../../../types/ObjectId';

export type UserForPost = {
	_id: ObjectId;
	firstName: string;
	lastName: string;
	university: string;
	department: string;
	profilePhotoUrl: string;
	friends: ObjectId[];
};
