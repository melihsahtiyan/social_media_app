import { Schema } from 'mongoose';
import { Entity } from './Entity';

export class Comment extends Entity {
	creator: Schema.Types.ObjectId;
	post: Schema.Types.ObjectId;
	content: string;
	isUpdated: boolean;
	likes: Schema.Types.ObjectId[];
	replies: Schema.Types.ObjectId[];

	constructor({
		creator,
		post,
		content,
		isUpdated,
		likes,
		replies,
	}: {
		creator: Schema.Types.ObjectId;
		post: Schema.Types.ObjectId;
		content: string;
		isUpdated: boolean;
		likes: Schema.Types.ObjectId[];
		replies: Schema.Types.ObjectId[];
	}) {
		super();
		this.creator = creator;
		this.post = post;
		this.content = content;
		this.isUpdated = isUpdated;
		this.likes = likes;
		this.replies = replies;
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
