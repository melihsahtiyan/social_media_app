import { Schema } from 'mongoose';
import { Entity } from './Entity';
import { Poll } from './Poll';
export class Post extends Entity {
	creator: Schema.Types.ObjectId;
	content: { caption: string; mediaUrls: Array<string> };
	likes: Schema.Types.ObjectId[];
	likeCount: number;
	comments: Schema.Types.ObjectId[];
	commentCount: number;
	poll: Poll;
	event?: Schema.Types.ObjectId;
	isUpdated: boolean;

	constructor({ _id, creator, content, likes, likeCount, comments, commentCount, poll, event, isUpdated, createdAt }) {
		super();
		this._id = _id;
		this.creator = creator;
		this.content = content;
		this.event = event;
		this.likes = likes;
		this.likeCount = likeCount;
		this.comments = comments;
		this.commentCount = commentCount;
		this.poll = poll;
		this.event = event;
		this.isUpdated = isUpdated;
		this.createdAt = createdAt;
	}

	getCreatorId(): string {
		return this.creator.toString();
	}

	isAuthor(userId: Schema.Types.ObjectId): boolean {
		return this.creator === userId ? true : false;
	}
	isLiked(userId: Schema.Types.ObjectId): boolean {
		if (this.likes.length === 0) return false;
		return this.likes.includes(userId) ? true : false;
	}
}
