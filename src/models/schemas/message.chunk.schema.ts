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
		ref: 'MessagePartition',
		default: function (this: MessageChunkDoc) {
			return this.isFull;
		},
	},
	nextPartition: {
		type: Schema.Types.ObjectId,
		ref: 'MessagePartition',
		required: null,
	},
	createdAt: {
		type: Date,
	},
	updatedAt: {
		type: Date,
	},
});

const messageChunks: Model<MessageChunkDoc> =
	mongoose.models.messageChunks || mongoose.model<MessageChunkDoc>('MessageChunk', messageChunkSchema);

export { messageChunks };
