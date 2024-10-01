import { ObjectId } from '../../../types/ObjectId';
import { Entity } from '../Entity';
import { MessageStatus, MessageTypes } from '../enums/messageEnums';

export class Message extends Entity {
	chatId: ObjectId;
	partitionId: ObjectId;
	creator: ObjectId;
	content: string;
	type: MessageTypes;
	isEdited: boolean;
	status: MessageStatus;
	replyTo?: ObjectId;
	isForwarded: boolean;
	mention?: ObjectId[];
	isDeleted?: boolean;
	deletedAt?: Date;

	constructor({
		_id,
		chatId,
		partitionId,
		creator,
		content,
		type,
		isEdited,
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
		this.partitionId = partitionId;
		this.creator = creator;
		this.content = content;
		this.type = type;
		this.isEdited = isEdited;
		this.status = MessageStatus.SENT;
		this.replyTo = replyTo;
		this.isForwarded = isForwarded;
		this.mention = mention;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.isDeleted = isDeleted;
		this.deletedAt = deletedAt;
	}
}
