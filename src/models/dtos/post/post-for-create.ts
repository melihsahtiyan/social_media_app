import { ObjectId } from '../../../types/ObjectId';
import { Poll } from '../../entities/Poll';

export interface PostForCreate {
	creator: ObjectId;
	content: { caption: string; mediaUrls: Array<string> };
	poll: Poll;
}
