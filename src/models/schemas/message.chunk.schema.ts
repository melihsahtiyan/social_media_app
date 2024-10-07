import mongoose, { Document, Model, Schema } from 'mongoose';
import { MessageChunk } from '../entities/Chat/MessageChunk';

export type MessageChunkDoc = Document & MessageChunk;

export const messageChunkSchema: Schema = new Schema({
	messages: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Message',
		},
	],
	chat: {
		type: Schema.Types.ObjectId,
		ref: 'Chat',
		required: true,
	},
	maxMessageCount: {
		type: Number,
		default: 50,
	},
	messageCount: {
		type: Number,
		default: 0,
	},
	partitionIndex: {
		type: Number,
	},
	isFull: {
		type: Boolean,
		default: false,
	},
	previousPartition: {
		type: Schema.Types.ObjectId,
		ref: 'MessageChunk',
		reqired: function (this: MessageChunkDoc): boolean {
			return this.isFull;
		},
	},
	nextPartition: {
		type: Schema.Types.ObjectId,
		ref: 'MessageChunk',
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	updatedAt: {
		type: Date,
		default: null,
	},
});

const messageChunks: Model<MessageChunkDoc> =
	mongoose.models.messageChunks || mongoose.model<MessageChunkDoc>('MessageChunk', messageChunkSchema);

export { messageChunks };
