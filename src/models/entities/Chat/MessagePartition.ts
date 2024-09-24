import { ObjectId } from '@/types/ObjectId';
import { Entity } from '../Entity';

export class MessagePartition extends Entity {
	messages: ObjectId[];
	maxMessageCount: number = 50;
	messageCount: number; // string messages counts 1 and media messages counts 10 and post or event messages counts 10
	partitionIndex: number;
	isFull: boolean;
	previousPartition: ObjectId;
	nextPartition: ObjectId; // New one should be first of the list and the oldest one should be last

	constructor({
		_id,
		messages,
		maxMessageCount,
		messageCount,
		partitionIndex,
		isFull,
		previousPartition,
		nextPartition,
		createdAt,
		updatedAt,
	}) {
		super();
		this._id = _id;
		this.messages = messages;
		this.maxMessageCount = maxMessageCount;
		this.messageCount = messageCount;
		this.partitionIndex = partitionIndex;
		this.isFull = isFull;
		this.previousPartition = previousPartition;
		this.nextPartition = nextPartition;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	// TODO: Add methods
	// addMessage(message: Message): void {
	// 	if (!this.isFull) {
	// 	this.messages.push(message._id);
	// 		switch (message.type) {
	// 			case 'text':
	// 				if (this.messageCount +1 > this.maxMessageCount) {
	// 				this.messageCount += 1;
	// 				this.isFull = true;
	// 				}
	// 				break;
	// 			case 'media':
	// 				this.messageCount += 10;
	// 				break;
	// 			case 'post':
	// 				this.messageCount += 10;
	// 				break;
	// 			case 'event':
	// 				this.messageCount += 10;
	// 				break;
	// 		}
	// 	}
	// }
}
