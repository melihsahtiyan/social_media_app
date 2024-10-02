import { ObjectId } from '../../../types/ObjectId';
import { Entity } from '../Entity';

export class Chat extends Entity {
	// Update members
	members: ObjectId[];

	// Creating new chunks
	messageChunks: ObjectId[];

	// Adding or removing media, post, event
	sharedMedias: string[];
	sharedPosts: ObjectId[];
	sharedEvents: ObjectId[];

	// Pinning or unpinning message
	pinnedMessages: Array<{
		pinnedUser: ObjectId[];
		messageId: ObjectId;
	}>;

	// Marking or unmarking message as unread
	unreadMessages: Array<{
		userId: ObjectId;
		messageId: ObjectId;
	}>;

	// Details
	description?: string;
	avatar?: string;

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
		description,
		avatar,
		createdAt,
		updatedAt,
	}) {
		super();
		this._id = _id;
		this.members = members;
		this.messageChunks = messagePartitions;
		this.sharedMedias = sharedMedias;
		this.sharedPosts = sharedPosts;
		this.sharedEvents = sharedEvents;
		this.pinnedMessages = pinnedMessages;
		this.unreadMessages = unreadMessages;
		this.isGroup = isGroup;
		this.admins = admins;
		this.title = title;
		this.description = description;
		this.avatar = avatar;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	async addMember(member: ObjectId) {
		this.members.push(member);
	}

	async removeMember(member: ObjectId) {
		this.members = this.members.filter(m => m !== member);
	}

	isMember(member: ObjectId): boolean {
		return this.members.find(chatMember => chatMember.toString() === member.toString()) ? true : false;
	}

	isAdmin(admin: ObjectId): boolean {
		return this.admins.find(chatAdmin => chatAdmin.toString() === admin.toString()) ? true : false;
	}

	async pushMessagePartition(messagePartition: ObjectId) {
		this.messageChunks.push(messagePartition);
		throw new Error('Not implemented');
	}

	async setAvatar(avatar: string) {
		this.avatar = avatar;
	}

	async setDetails(description?: string) {
		this.description = description;
	}

	async setGroupDetails({ isGroup, admins, title }: { isGroup?: boolean; admins?: ObjectId[]; title?: string }) {
		this.isGroup = isGroup;
		this.admins = admins;
		this.title = title;
	}
}
