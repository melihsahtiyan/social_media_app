import mongoose, { Document, Model, model, Schema } from 'mongoose';
import { Message } from '../entities/Chat/Message';
import { MessageStatus, MessageTypes } from '../entities/enums/messageEnums';

export type MessageDoc = Document & Message;

export const messageSchema = new Schema({
	chatId: {
		type: Schema.Types.ObjectId,
		ref: 'Chat',
		required: true,
	},
	partitionId: {
		type: Schema.Types.ObjectId,
		ref: 'MessagePartition',
		required: true,
	},
	creator: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		enum: MessageTypes,
		required: true,
	},
	isEdited: {
		type: Boolean,
		default: false,
	},
	status: {
		type: String,
		enum: MessageStatus,
		default: MessageStatus.SENT,
	},
	replyTo: {
		type: Schema.Types.ObjectId,
		ref: 'Message',
		default: null,
	},
	isForwarded: {
		type: Boolean,
		default: false,
	},
	mention: {
		type: [Schema.Types.ObjectId],
		ref: 'User',
		default: [],
		required: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: null,
	},
	isDeleted: {
		type: Boolean,
		default: false,
	},
	deletedAt: {
		type: Date,
		default: null,
	},
});

const messages: Model<MessageDoc> = mongoose.models.messages || model<MessageDoc>('Message', messageSchema);

export { messages };
