import { MessageChunkForCreate } from '../../src/models/dtos/message-chunk/message-chunk-for-create';
import { MessageChunk } from '../../src/models/entities/Chat/MessageChunk';
import { messageChunks } from '../../src/models/schemas/message.chunk.schema';
import { MessageChunkRepository } from '../../src/repositories/message-chunk-repository';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

describe('MessageChunkRepository', () => {
	let messageChunkRepo: MessageChunkRepository;
	let chunkId: mongoose.Schema.Types.ObjectId;
	let messageChunk: MessageChunk;

	beforeAll(async () => {
		await mongoose.connect(process.env.TEST_CONNECTION_STRING as string);

		messageChunkRepo = new MessageChunkRepository();

		const chunkForCreate = {
			messages: [],
			maxMessageCount: 50,
			messageCount: 0,
			partitionIndex: 0,
			isFull: false,
			previousPartition: null,
			nextPartition: null,
			createdAt: new Date(Date.now()),
			updatedAt: new Date(Date.now()),
		};

		messageChunk = await messageChunks.create(chunkForCreate);
	});

	beforeEach(() => {});

	describe('create', () => {
		it('should create a new message chunk', async () => {
			// Arrange
			const chunkForCreate: MessageChunkForCreate = {
				chatId: new mongoose.Schema.Types.ObjectId('MockedObjectId'),
			};

			// Act
			const createdChunk: MessageChunk = await messageChunkRepo.create(chunkForCreate);
			chunkId = createdChunk._id;

			// Assert
			expect(createdChunk).toEqual(expect.objectContaining(chunkForCreate));
			expect(chunkId).not.toBeNull();
			expect(chunkId).not.toBeUndefined();
		});
	});

	describe('getAll', () => {
		it('Should return message chunk', async () => {
			const chunks: Array<MessageChunk> = await messageChunkRepo.getAll();

			expect(chunks).not.toBeNull();
			expect(chunks).not.toBeUndefined();
		});
	});

	describe('getById', () => {
		it('Should return message chunk', async () => {
			const chunkData: MessageChunk = await messageChunkRepo.getById(chunkId.toString());

			expect(chunkData).not.toBeNull();
			expect(chunkData).not.toBeUndefined();
		});
	});

	describe('update', () => {
		it('Should update message chunk', async () => {
			// Arrange
			const chunkToUpdate: MessageChunk = { ...messageChunk };

			// Act
			const updatedChunk: MessageChunk = await messageChunkRepo.update(chunkToUpdate);

			// Assert
			expect(messageChunk).toEqual(expect.objectContaining(updatedChunk));
		});
	});

	describe('delete', () => {
		it('Should delete message chunk', async () => {
			// Act
			const isDeleted: boolean = await messageChunkRepo.delete(chunkId.toString());

			// Assert
			expect(isDeleted).toBeTruthy();
		});
	});

	afterAll(async () => {
		await messageChunks.deleteOne(messageChunk);
		await messageChunks.findByIdAndDelete(chunkId);

		await mongoose.connection.close();
	});
});
