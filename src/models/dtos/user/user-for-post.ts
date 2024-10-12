import { Dto } from '../Dto';
import { ObjectId } from '../../../types/ObjectId';

export interface UserForPost extends Dto {
	_id: ObjectId;
	firstName: string;
	lastName: string;
	university: string;
	department: string;
	profilePhotoUrl: string;
	friends: ObjectId[];
};
