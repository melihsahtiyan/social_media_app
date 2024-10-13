import 'reflect-metadata';
import { Chat } from '../models/entities/Chat/Chat';
import { ChatDoc, chats } from '../models/schemas/chat.schema';
import { IChatRepository } from '../types/repositories/IChatRepository';
import { injectable } from 'inversify';
import { ChatForCreate } from '../models/dtos/chat/chat-for-create';
import { ObjectId } from '../types/ObjectId';
import { CustomError } from '../types/error/CustomError';
import { RepositoryBase } from './repository-base';

@injectable()
export class ChatRepository extends RepositoryBase<Chat> implements IChatRepository {
	constructor() {
		super(chats, Chat);
	}
	override async create(chat: ChatForCreate): Promise<boolean> {
		try {
			const createdChat: ChatDoc = await this.model.create({
				admins: chat.admins,
				isGroup: chat.isGroup,
				title: chat.title,
				members: chat.members,
			});

			if (!createdChat) throw new Error('Chat could not be created');
			return !!createdChat;
		} catch (e) {
			const error: CustomError = new Error(e.message);
			error.className = 'ChatRepository';
			error.functionName = 'create';

			throw error;
		}
	}
	async addMessageChunk(chatId: ObjectId, messageChunkId: ObjectId): Promise<boolean> {
		const updatedChat: ChatDoc = await this.model.findOneAndUpdate(
			{ _id: chatId },
			{
				$push: {
					messageChunks: {
						$each: [messageChunkId],
						$position: 0, // Add messageChunk to the beginning of the array
					},
				},
			}
		);

		return !!updatedChat.chunks.find(chunk => chunk === messageChunkId);
	}
	async getByMembers(members: Array<string>): Promise<Chat> {
		const chat: ChatDoc = await this.model.findOne({ members: { $all: members as string[] } });

		if (chat) return new Chat(chat.toObject());
	}
	async getAll(filter?: Partial<Chat>): Promise<Array<Chat>> {
		const allChats = await this.model.find(filter).populate('members', '_id firstName lastName');
		return allChats.map(chat => new Chat(chat.toObject()));
	}
	async getAllByUserId(userId: string): Promise<Array<Chat>> {
		const allChats = await this.model.find({ members: { $in: [userId] } }).populate('members', '_id firstName lastName');

		return allChats.map(chat => new Chat(chat.toObject()));
	}
	async addChunk(chatId: ObjectId, chunkId: ObjectId): Promise<Chat> {
		const chatToUpdate = await this.model.findById(chatId);

		if (!chatToUpdate) return null;
		const chat = new Chat(chatToUpdate.toObject());
		chat.addChunk(chunkId);

		const updatedChat = await this.model.findByIdAndUpdate(chatId, chat, { new: true });
		return new Chat(updatedChat.toObject());
	}
	async addMember(chatId: ObjectId, memberId: ObjectId): Promise<Chat> {
		const updatedChat = await this.model.findByIdAndUpdate(chatId, { $push: { members: memberId } }, { new: true });

		return new Chat(updatedChat.toObject());
	}
	async removeMember(chatId: ObjectId, memberId: ObjectId): Promise<Chat> {
		const updatedChat = await this.model.findByIdAndUpdate(chatId, { $pull: { members: memberId } }, { new: true });

		return new Chat(updatedChat.toObject());
	}
}
