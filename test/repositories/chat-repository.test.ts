import { ChatForCreate } from '@/models/dtos/chat/chat-for-create';
import { chats } from '../../src/models/schemas/chat.schema';
import { Chat } from '../../src/models/entities/Chat/Chat';
import { ChatRepository } from '../../src/repositories/chat-repository';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ObjectId } from '@/types/ObjectId';

dotenv.config();

describe('ChatRepository', () => {
	let chatRepository: ChatRepository;
	let chatId: ObjectId;
	let chat: Chat;

	beforeAll(async () => {
		await mongoose.connect(process.env.TEST_CONNECTION_STRING as string);

		chatRepository = new ChatRepository();

		const chatForCreate: ChatForCreate = {
			members: [
				new mongoose.Schema.Types.ObjectId('MockedObjectId1'),
				new mongoose.Schema.Types.ObjectId('MockedObjectId2'),
			],
			admins: [],
			isGroup: false,
			title: null,
		};

		const createdChat: Chat = await chatRepository.create(chatForCreate);

		chat = createdChat;
	});

	beforeEach(() => {});

	describe('create', () => {
		it('should create a new chat', async () => {
			// Arrange
			const chat: ChatForCreate = {
				members: [
					new mongoose.Schema.Types.ObjectId('MockedObjectId1'),
					new mongoose.Schema.Types.ObjectId('MockedObjectId2'),
				],
				admins: [],
				isGroup: false,
				title: null,
			};

			// Act
			const createdChat: Chat = await chatRepository.create(chat);
			chatId = createdChat._id;

			// Assert
			expect(createdChat).toEqual(expect.objectContaining(chat));
			expect(chatId).not.toBeNull();
			expect(chatId).not.toBeUndefined();
		});
	});

	describe('getAll', () => {
		it('Should return chats', async () => {
			const chats: Array<Chat> = await chatRepository.getAll();

			expect(chats).not.toBeNull();
			expect(chats).not.toBeUndefined();
			expect(chats).toBeInstanceOf(Array);
			expect(chats[0]).toBeInstanceOf(Chat);
		});
	});

	describe('getById', () => {
		it('Should return chat by id', async () => {
			const chat: Chat = await chatRepository.getById(chatId.toString());

			expect(chat).not.toBeNull();
			expect(chat).not.toBeUndefined();
			expect(chat).toBeInstanceOf(Chat);
		});
	});

	describe('update', () => {
		it('Should update chat', async () => {
			const chatToUpdate: Chat = chat;
			chatToUpdate.title = 'Updated title';

			const updatedChat: Chat = await chatRepository.update(chatToUpdate);

			expect(updatedChat).not.toBeNull();
			expect(updatedChat).not.toBeUndefined();
			expect(updatedChat).toBeInstanceOf(Chat);
			expect(updatedChat.title).toEqual('Updated title');
		});
	});

	describe('delete', () => {
		it('Should delete chat', async () => {
			const isDeleted: boolean = await chatRepository.delete(chatId.toString());

			expect(isDeleted).toBe(true);
		});
	});

	afterAll(async () => {
		await chats.deleteOne(chat);
		await chats.findByIdAndDelete(chatId);

		await mongoose.connection.close();
	});
});
