import { ObjectId } from '../../../types/ObjectId';

export type ChatDetailDto = {
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
