import { CustomError } from '../../../types/error/CustomError';
import { ObjectId } from '../../../types/ObjectId';
import { Entity } from '../Entity';
import { MessageTypes } from '../enums/messageEnums';
import { Message } from './Message';

export class MessageChunk extends Entity {
	messages: ObjectId[];
	chat: ObjectId;
	maxMessageCount: number = 50;
	messageCount: number; // string messages counts 1 and media messages counts 10 and post or event messages counts 10
	isFull: boolean;
	previousChunk: ObjectId;
	nextChunk: ObjectId; // New one should be first of the list and the oldest one should be last

	constructor({
		_id,
		messages,
		chat,
		messageCount,
		isFull,
		previousChunk,
		nextChunk,
		createdAt,
		updatedAt,
	}) {
		super();
		this._id = _id;
		this.messages = messages;
		this.chat = chat;
		this.messageCount = messageCount;
		this.isFull = isFull;
		this.previousChunk = previousChunk;
		this.nextChunk = nextChunk;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	async addMessage(message: Message): Promise<boolean> {
		if (!this.isFull) {
			this.messages.push(message._id);
			switch (message.type) {
				case MessageTypes.TEXT:
					if (this.messageCount + 1 > this.maxMessageCount) {
						this.messageCount += 1;
						this.isFull = true;
					} else {
						this.messageCount += 1;
					}
					return true;
					break;
				case MessageTypes.MEDIA:
					if (this.messageCount + 10 > this.maxMessageCount) {
						this.messageCount += 10;
						this.isFull = true;
					} else {
						this.messageCount += 10;
					}
					return true;
					break;
				case MessageTypes.POST:
					if (this.messageCount + 10 > this.maxMessageCount) {
						this.messageCount += 10;
						this.isFull = true;
					} else {
						this.messageCount += 10;
					}
					return true;
					break;
				case MessageTypes.EVENT:
					if (this.messageCount + 10 > this.maxMessageCount) {
						this.messageCount += 10;
						this.isFull = true;
					} else {
						this.messageCount += 10;
					}
					return true;
					break;
				default:
					throw new CustomError('Invalid message type', 400, null, 'MessageChunk', 'addMessage');
			}
		} else {
			return false;
		}
	}

	dropMessage(message: Message): boolean {
		this.messages = this.messages.filter(id => id.toString() !== message._id.toString());
		switch (message.type) {
			case MessageTypes.TEXT:
				this.messageCount -= 1;
				return true;
			case MessageTypes.MEDIA:
				this.messageCount -= 10;
				return true;
			case MessageTypes.POST:
				this.messageCount -= 10;
				return true;
			case MessageTypes.EVENT:
				this.messageCount -= 10;
				return true;
			default:
				return false;
		}
	}
}
