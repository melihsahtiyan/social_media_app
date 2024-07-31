import { Schema } from 'mongoose';
import { Entity } from './Entity';
import { CommentForCreateDto } from '../dtos/comment/comment-for-create';

export class Comment extends Entity {
	creator: Schema.Types.ObjectId;
	post: Schema.Types.ObjectId;
	content: string;
	isUpdated: boolean;
	likes: Schema.Types.ObjectId[];
	replies: Schema.Types.ObjectId[];

	constructor(commentForCreate: CommentForCreateDto) {
		super();
		this.creator = commentForCreate.creator;
		this.post = commentForCreate.post;
		this.content = commentForCreate.content;
		this.isUpdated = false;
		this.likes = [];
		this.replies = [];
	}

	getPostId(): string {
		return this.post.toString();
	}
	isCreator(userId: string): boolean {
		return this.creator.toString() === userId ? true : false;
	}
	checkReplyPostIdMatches(replyPostId: string): boolean {
		return this.post.toString() === replyPostId ? true : false;
	}
}
