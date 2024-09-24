import 'reflect-metadata';
import { Chat } from '../models/entities/Chat/Chat';
import { ChatDoc, chats } from '../models/schemas/chat.schema';
import { IChatRepository } from '../types/repositories/IChatRepository';
import { injectable } from 'inversify';
import { ChatForCreate } from '@/models/dtos/chat/chat-for-create';

@injectable()
export class ChatRepository implements IChatRepository {
	async create(chat: ChatForCreate): Promise<Chat> {
		const createdChat: ChatDoc = await chats.create(chat);

		return new Chat(createdChat.toObject());
	}
	async getById(chatId: string): Promise<Chat> {
		const chat = await chats.findById(chatId);

		return new Chat(chat.toObject());
	}
	async getAll(): Promise<Array<Chat>> {
		const allChats = await chats.find();

		return allChats.map(chat => new Chat(chat.toObject()));
	}
	async update(chat: Chat): Promise<Chat> {
		const updatedChat = await chats.findByIdAndUpdate(chat._id, chat, { new: true });

		return new Chat(updatedChat.toObject());
	}
	async delete(chatId: string): Promise<boolean> {
		const deletedChat = await chats.findByIdAndDelete(chatId);

		return !!deletedChat;
	}
}
