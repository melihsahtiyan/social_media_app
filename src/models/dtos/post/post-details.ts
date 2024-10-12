import { ObjectId } from '../../../types/ObjectId';
import { UserForPost } from '../user/user-for-post';
import { Poll } from '../../entities/Poll';
import { Dto } from '../Dto';

export interface PostDetails extends Dto {
	_id: ObjectId;
	creator: UserForPost;
	content: {
		caption: string;
		mediaUrls: string[];
	};
	poll: Poll;
	likes: ObjectId[];
	likeCount: number;
	comments: ObjectId[];
	commentCount: number;
	createdAt: Date;
	isUpdated: boolean;
	isLiked: boolean;
}
