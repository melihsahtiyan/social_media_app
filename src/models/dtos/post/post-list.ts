import { ObjectId } from '../../../types/ObjectId';
import { Poll } from '../../entities/Poll';
import { Dto } from '../Dto';

export default interface PostListDto extends Dto {
	_id: ObjectId;
	creator: ObjectId;
	content: { caption: string; mediaUrls: string[] };
	likes: ObjectId[];
	comments: ObjectId[];
	poll: Poll;
	isUpdated: boolean;
	createdAt: Date;
	isLiked: boolean;
}


