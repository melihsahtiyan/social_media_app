import { Dto } from '../Dto';
import { ObjectId } from '../../../types/ObjectId';

export interface UserForSearchDto extends Dto {
	_id: ObjectId;
	fullName: string;
	profilePhotoUrl: string;
	isFriend: boolean;
}
