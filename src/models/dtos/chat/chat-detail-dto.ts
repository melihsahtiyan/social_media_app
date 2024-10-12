import { ObjectId } from '../../../types/ObjectId';
import { Dto } from '../Dto';

export interface ChatDetailDto extends Dto {
	_id: ObjectId;
	isGroup: boolean;
	admins?: Array<{
		_id: ObjectId;
		firstName: string;
		lastName: string;
	}>;
	title?: string;
	description?: string;
	avatar?: string;
};
