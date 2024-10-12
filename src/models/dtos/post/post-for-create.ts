import { ObjectId } from '../../../types/ObjectId';
import { Poll } from '../../entities/Poll';
import { Dto } from '../Dto';

export interface PostForCreate extends Dto {
	creator: ObjectId;
	content: { caption: string; mediaUrls: Array<string> };
	poll: Poll;
}
