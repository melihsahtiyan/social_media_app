import { ObjectId } from '@/types/ObjectId';
import { Entity } from './Entity';

export class Comment extends Entity {
	creator: ObjectId;
	post: ObjectId;
	content: string;
	isUpdated: boolean;
	likes: ObjectId[];
	replies: ObjectId[];

	constructor({
		creator,
		post,
		content,
		isUpdated,
		likes,
		replies,
	}: {
		creator: ObjectId;
		post: ObjectId;
		content: string;
		isUpdated: boolean;
		likes: ObjectId[];
		replies: ObjectId[];
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
	getCreatorId(): string {
		return this.creator.toString();
	}
	addLike(userId: ObjectId): void {
		if (!this.likes.includes(userId)) this.likes.push(userId);
	}
	removeLike(userId: ObjectId): void {
		this.likes = this.likes.filter(like => like.toString() !== userId.toString());
	}
	addReply(replyId: ObjectId): void {
		if (!this.replies.includes(replyId)) this.replies.push(replyId);
	}
	removeReply(replyId: ObjectId): void {
		this.replies = this.replies.filter(reply => reply.toString() !== replyId.toString());
	}
	getLikeCount(): number {
		return this.likes.length;
	}
}
