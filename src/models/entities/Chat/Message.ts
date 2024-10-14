import { ObjectId } from '../../../types/ObjectId';
import { Entity } from '../Entity';
import { MessageStatus, MessageTypes } from '../enums/messageEnums';

export class Message extends Entity {
	chatId: ObjectId;
	chunkId: ObjectId;
	creator: ObjectId;
	content: string;
	type: MessageTypes;
	isEdited: boolean;
	statuses: { status: MessageStatus; userId: ObjectId }[];
	replyTo?: ObjectId;
	isForwarded: boolean;
	mention?: ObjectId[];
	isDeleted?: boolean;
	deletedAt?: Date;

	constructor({
		_id,
		chatId,
		chunkId,
		creator,
		content,
		type,
		isEdited,
		statuses,
		replyTo,
		isForwarded,
		mention,
		createdAt,
		updatedAt,
		isDeleted,
		deletedAt,
	}) {
		super();
		this._id = _id;
		this.chatId = chatId;
		this.chunkId = chunkId;
		this.creator = creator;
		this.content = content;
		this.type = type;
		this.isEdited = isEdited;
		this.statuses = statuses;
		this.replyTo = replyTo;
		this.isForwarded = isForwarded;
		this.mention = mention;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.isDeleted = isDeleted;
		this.deletedAt = deletedAt;
	}

	isEditable(userId: ObjectId): boolean {
		return (
			this.type === MessageTypes.TEXT &&
			!this.isForwarded &&
			!this.isDeleted &&
			this.creator.toString() === userId.toString()
		);
	}

	editMessage(content: string): void {
		this.content = content;
		this.isEdited = true;
	}

	deleteMessage(): void {
		this.isDeleted = true;
		this.deletedAt = new Date(Date.now());
	}
}
