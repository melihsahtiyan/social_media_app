import { ObjectId } from '@/types/ObjectId';
import { Entity } from '../Entity';
import { MessagePartition } from './MessagePartition';

export class Chat extends Entity {
	members: ObjectId[];
	messagePartitions: MessagePartition[];
	sharedMedias: string[];
	sharedPosts: ObjectId[];
	sharedEvents: ObjectId[];
	pinnedMessages: Array<{
		pinnedUser: ObjectId[];
		messageId: ObjectId;
	}>;
	unreadMessages: Array<{
		userId: ObjectId;
		messageId: ObjectId;
	}>;

	// Group chat
	isGroup: boolean;
	admins?: ObjectId[];
	title?: string;

	constructor({
		_id,
		members,
		messagePartitions,
		sharedMedias,
		sharedPosts,
		sharedEvents,
		pinnedMessages,
		unreadMessages,
		isGroup,
		admins,
		title,
		createdAt,
		updatedAt,
	}) {
		super();
		this._id = _id;
		this.members = members;
		this.messagePartitions = messagePartitions;
		this.sharedMedias = sharedMedias;
		this.sharedPosts = sharedPosts;
		this.sharedEvents = sharedEvents;
		this.pinnedMessages = pinnedMessages;
		this.unreadMessages = unreadMessages;
		this.isGroup = isGroup;
		this.admins = admins;
		this.title = title;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}
}
