import mongoose from 'mongoose';
import { Poll } from '../../../models/entites/Poll';

interface PostList {
	_id: mongoose.Schema.Types.ObjectId;
	creator: mongoose.Schema.Types.ObjectId;
	content: { caption: string; mediaUrls: string[] };
	likes: mongoose.Schema.Types.ObjectId[];
	comments: mongoose.Schema.Types.ObjectId[];
	poll: Poll;
	isUpdated: boolean;
	createdAt: Date;
	isLiked: boolean;
}

export default PostList;
