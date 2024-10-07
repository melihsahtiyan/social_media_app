import mongoose, { Document, Model, Schema } from 'mongoose';
import { Chat } from '../entities/Chat/Chat';

export type ChatDoc = Document & Chat;

const chatSchema = new Schema({
	members: {
		type: Array<Schema.Types.ObjectId>,
		ref: 'User',
		required: true,
		validate: {
			validator: function (members: Schema.Types.ObjectId[]) {
				return members.length > 1;
			},
			message: 'Chat must have at least 2 members',
		},
	},
	chunks: {
		type: Array<Schema.Types.ObjectId>,
		ref: 'MessageChunk',
		default: [],
	},
	sharedMedias: [{ type: String, default: [] }],
	sharedPosts: {
		type: Array<Schema.Types.ObjectId>,
		ref: 'Post',
		default: [],
	},
	sharedEvents: {
		type: Array<Schema.Types.ObjectId>,
		ref: 'ClubEvent',
		default: [],
	},
	pinnedMessages: {
		type: [
			{
				pinnedUser: {
					type: Schema.Types.ObjectId,
					ref: 'User',
				},
				messages: {
					type: Array<Schema.Types.ObjectId>,
					ref: 'Message',
				},
			},
		],
		default: [],
		length: function (this: ChatDoc) {
			return this.members.length;
		},
	},
	unreadMessages: {
		type: [
			{
				userId: {
					type: Schema.Types.ObjectId,
					ref: 'User',
				},
				messages: {
					type: Array<Schema.Types.ObjectId>,
					ref: 'Message',
				},
			},
		],
		default: [],
		length: function (this: ChatDoc) {
			return this.members.length;
		},
	},
	isGroup: {
		type: Boolean,
		default: function (this: ChatDoc) {
			if (this.members.length > 2) {
				return true;
			} else {
				return false;
			}
		},
	},
	admins: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: function (this: ChatDoc) {
				return this.isGroup;
			},
		},
	],
	title: {
		type: String,
		required: function (this: ChatDoc) {
			return this.isGroup;
		},
	},
	description: {
		type: String,
		default: null,
		required: false,
	},
	avatar: {
		type: String,
		default: null,
		required: function (this: ChatDoc) {
			return this.isGroup;
		},
	},
	createdAt: {
		type: Date,
		default: Date.now,
		required: true,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
		required: true,
	},
});

const chats: Model<ChatDoc> = mongoose.models.chats || mongoose.model<ChatDoc>('Chat', chatSchema);

export { chats };
