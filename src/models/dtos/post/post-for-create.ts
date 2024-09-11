import { ObjectId } from '../../../types/ObjectId';
import { Poll } from '../../../models/entites/Poll';

export interface PostForCreate {
	creator: ObjectId;
	content: { caption: string; mediaUrls: Array<string> };
	poll: Poll;
}
