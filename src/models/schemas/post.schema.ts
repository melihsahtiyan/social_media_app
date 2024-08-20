import mongoose from 'mongoose';
import { Post } from '../entites/Post';

export type PostDoc = mongoose.Document & Post;

export const postSchema = new mongoose.Schema({
	creator: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	content: {
		caption: String,
		mediaUrls: Array<string>
	},
	likes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			default: []
		}
	],
	createdAt: {
		type: Date,
		default: Date.now()
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		}
	],
	commentCount: {
		type: Number,
		default: 0
	},
	poll: {
		type: {
			question: String,
			options: Array<{ optionName: string; voteCount: number }>,
			votes: Array<{
				voter: mongoose.Schema.Types.ObjectId;
				option: string;
			}>,
			totalVotes: Number,
			expiresAt: Date
		},
		_id: false,
		required: false
	},
	event: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Event',
		required: false
	},
	isUpdated: {
		type: Boolean,
		default: false
	}
});

const posts: mongoose.Model<PostDoc> = mongoose.models.posts || mongoose.model<PostDoc>('Post', postSchema);

export { posts };
