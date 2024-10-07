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
			const createdChat: ChatDoc = await chats.create({
				admins: chat.admins,
				isGroup: chat.isGroup,
				title: chat.title,
				members: chat.members,
			});

			if (!createdChat) throw new Error('Chat could not be created');
			return new Chat(createdChat.toObject());
		} catch (e) {
			const error: CustomError = new Error(e.message);
			error.className = 'ChatRepository';
			error.functionName = 'create';

			throw error;
		}
	}
	async addMessageChunk(chatId: ObjectId, messageChunkId: ObjectId): Promise<Chat> {
		const updatedChat: ChatDoc = await chats.findOneAndUpdate(
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

		return new Chat(updatedChat.toObject());
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
	async getAll(filter?: Partial<Chat>): Promise<Array<Chat>> {
		const allChats = await chats.find(filter).populate('members', '_id firstName lastName');

		return allChats.map(chat => new Chat(chat.toObject()));
	}
	async getAllByUserId(userId: string): Promise<Array<Chat>> {
		const allChats = await chats.find({ members: { $in: [userId] } }).populate('members', '_id firstName lastName');

		return allChats.map(chat => new Chat(chat.toObject()));
	}
	async update(chat: Chat): Promise<Chat> {
		const updatedChat = await chats.findByIdAndUpdate(chat._id, chat, { new: true });

		return new Chat(updatedChat.toObject());
	}
	async addChunk(chatId: ObjectId, chunkId: ObjectId): Promise<Chat> {
		const chatToUpdate = await chats.findById(chatId);

		if (!chatToUpdate) return null;
		const chat = new Chat(chatToUpdate.toObject());
		chat.addChunk(chunkId);

		const updatedChat = await chats.findByIdAndUpdate(chatId, chat, { new: true });
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
