import { Schema } from 'mongoose';
import { UserForPost } from '../user/user-for-post';
import { Poll } from '../../../models/entites/Poll';

export interface PostDetails {
	_id: Schema.Types.ObjectId;
	creator: UserForPost;
	content: {
		caption: string;
		mediaUrls: string[];
	};
	poll: Poll;
	likes: Schema.Types.ObjectId[];
	likeCount: number;
	comments: Schema.Types.ObjectId[];
	commentCount: number;
	createdAt: Date;
	isUpdated: boolean;
	isLiked: boolean;
}
