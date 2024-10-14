import { ObjectId } from '../../../types/ObjectId';
import { Entity } from '../Entity';

export class Chat extends Entity {
	// Update members
	members: ObjectId[];

	// Creating new chunks
	chunks: ObjectId[];

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

	constructor(chat: Partial<Chat>) {
		super();
		this._id = chat._id;
		this.members = chat.members;
		this.chunks = chat.chunks;
		this.sharedMedias = chat.sharedMedias;
		this.sharedPosts = chat.sharedPosts;
		this.sharedEvents = chat.sharedEvents;
		this.pinnedMessages = chat.pinnedMessages;
		this.unreadMessages = chat.unreadMessages;
		this.isGroup = chat.isGroup;
		this.admins = chat.admins;
		this.title = chat.title;
		this.description = chat.description;
		this.avatar = chat.avatar;
		this.createdAt = chat.createdAt;
		this.updatedAt = chat.updatedAt;
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

	addChunk(messageChunk: ObjectId) {
		this.chunks?.unshift(messageChunk);
	}

	getChunk(chunkId: ObjectId): ObjectId {
		return this.chunks.find(chunk => chunk.toString() === chunkId.toString()) as ObjectId;
	}

	getActiveChunk(): ObjectId {
		return this.chunks[0];
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
