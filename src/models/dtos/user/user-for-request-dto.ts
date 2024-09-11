import { ObjectId } from '../../../types/ObjectId';

export interface UserForRequestDto {
	_id: ObjectId;
	firstName: string;
	lastName: string;
	profilePhotoUrl: string;
}
