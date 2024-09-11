import { ObjectId } from '../../../types/ObjectId';

export interface UserForSearchDto {
	_id: ObjectId;
	fullName: string;
	profilePhotoUrl: string;
	isFriend: boolean;
}
