import { Dto } from '../Dto';
import { ObjectId } from '../../../types/ObjectId';

export interface UserForRequestDto extends Dto {
	_id: ObjectId;
	firstName: string;
	lastName: string;
	profilePhotoUrl: string;
}
