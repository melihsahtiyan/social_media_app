import mongoose from 'mongoose';

export interface PostForLike {
	_id: mongoose.Schema.Types.ObjectId;
	creator: mongoose.Schema.Types.ObjectId;
	content: { caption: string; mediaUrls: string[] };
	likes: mongoose.Schema.Types.ObjectId[];
	likeCount: number;
	isUpdated: boolean;
}
