import { ObjectId } from '../../types/ObjectId';
import { Entity } from './Entity';
import { Poll } from './Poll';
export class Post extends Entity {
	creator: ObjectId;
	content: { caption: string; mediaUrls: Array<string> };
	likes: ObjectId[];
	comments: ObjectId[];
	commentCount: number;
	poll: Poll;
	event?: ObjectId;
	isUpdated: boolean;

	constructor({ _id, creator, content, likes, comments, commentCount, poll, event, isUpdated, createdAt }) {
		super();
		this._id = _id;
		this.creator = creator;
		this.content = content;
		this.event = event;
		this.likes = likes;
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

	isAuthor(userId: ObjectId): boolean {
		return this.creator === userId ? true : false;
	}
	isLiked(userId: ObjectId): boolean {
		if (this.likes.length === 0) return false;
		return this.likes.includes(userId) ? true : false;
	}
	getLikeCount(): number {
		return this.likes.length;
	}
}
