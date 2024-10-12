import { ObjectId } from '../../../types/ObjectId';
import { Dto } from '../Dto';

export interface PostForLike extends Dto {
	_id: ObjectId;
	creator: ObjectId;
	content: { caption: string; mediaUrls: string[] };
	likes: ObjectId[];
	likeCount: number;
	isUpdated: boolean;
}
