import 'reflect-metadata';
import { Chat } from '../models/entities/Chat/Chat';
import { ChatDoc, chats } from '../models/schemas/chat.schema';
import { IChatRepository } from '../types/repositories/IChatRepository';
import { injectable } from 'inversify';
import { ChatForCreate } from '../models/dtos/chat/chat-for-create';
import { ObjectId } from '../types/ObjectId';
import { CustomError } from '../types/error/CustomError';

@injectable()
export class ChatRepository implements IChatRepository {
	async create(chat: ChatForCreate): Promise<Chat> {
		try {
			const createdChat: ChatDoc = await chats.create(chat);

			if (!createdChat) throw new Error('Chat could not be created');
			return new Chat(createdChat.toObject());
		} catch (e) {
			const error: CustomError = new Error(e.message);
			error.className = 'ChatRepository';
			error.functionName = 'create';

			throw error;
		}
	}
	async get(filter: Partial<Chat>): Promise<Chat> {
		const chatDoc = await chats.findOne(filter);

		if (!chatDoc) return null;

		return new Chat(chatDoc.toObject());
	}
	async getById(chatId: string): Promise<Chat> {
		const chat = await chats.findById(chatId);

		if (!chat) return null;
		return new Chat(chat.toObject());
	}
	async getByMembers(members: Array<string>): Promise<Chat> {
		const chat: ChatDoc = await chats.findOne({ members: { $all: members as string[] } });

		if (chat) return new Chat(chat.toObject());
	}
	async getAll(): Promise<Array<Chat>> {
		const allChats = await chats.find();

		return allChats.map(chat => new Chat(chat.toObject()));
	}
	async update(chat: Chat): Promise<Chat> {
		const updatedChat = await chats.findByIdAndUpdate(chat._id, chat, { new: true });

		return new Chat(updatedChat.toObject());
	}
	async addMember(chatId: ObjectId, memberId: ObjectId): Promise<Chat> {
		const updatedChat = await chats.findByIdAndUpdate(chatId, { $push: { members: memberId } }, { new: true });

		return new Chat(updatedChat.toObject());
	}
	async removeMember(chatId: ObjectId, memberId: ObjectId): Promise<Chat> {
		const updatedChat = await chats.findByIdAndUpdate(chatId, { $pull: { members: memberId } }, { new: true });

		return new Chat(updatedChat.toObject());
	}
	async delete(chatId: string): Promise<boolean> {
		const deletedChat = await chats.findByIdAndDelete(chatId);

		return !!deletedChat;
	}
}
