import mongoose, { Document, Model, Schema } from 'mongoose';
import { MessagePartition } from '../entities/Chat/MessagePartition';

export type MessagePartitionDoc = Document & MessagePartition;

export const messagePartitionSchema: Schema = new Schema({
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
		default: null,
	},
	nextPartition: {
		type: Schema.Types.ObjectId,
		ref: 'MessagePartition',
		required: true,
	},
	createdAt: {
		type: Date,
	},
	updatedAt: {
		type: Date,
	},
});

const messagePartitions: Model<MessagePartitionDoc> =
	mongoose.models.messagePartitions || mongoose.model<MessagePartitionDoc>('MessagePartition', messagePartitionSchema);

export { messagePartitions };
