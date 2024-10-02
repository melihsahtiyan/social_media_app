import mongoose from 'mongoose';
import { Comment } from '../entities/Comment';

export type CommentDoc = mongoose.Document & Comment;

const commentSchema = new mongoose.Schema({
	creator: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Post'
	},
	content: {
		type: String
	},
	createdAt: {
		type: Date,
		default: Date.now,
		required: true
	},
	isUpdated: {
		type: Boolean,
		default: false
	},
	likes: {
		type: Array<mongoose.Schema.Types.ObjectId>,
		ref: 'User',
		default: []
	},
	replies: {
		type: Array<mongoose.Schema.Types.ObjectId>,
		ref: 'Comment',
		default: []
	}
});

const comments: mongoose.Model<CommentDoc> =
	mongoose.models.comments || mongoose.model<CommentDoc>('Comment', commentSchema);

export { comments };
