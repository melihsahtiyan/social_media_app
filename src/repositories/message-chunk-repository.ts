import 'reflect-metadata';
import { MessageChunkForCreate } from '../models/dtos/message-chunk/message-chunk-for-create';
import { MessageChunk } from '../models/entities/Chat/MessageChunk';
import { messageChunks } from '../models/schemas/message.chunk.schema';
import { IMessageChunkRepository } from '../types/repositories/IMessageChunkRepository';
import { injectable } from 'inversify';

@injectable()
export class MessageChunkRepository implements IMessageChunkRepository {
	async create(chunkToCreate: MessageChunkForCreate): Promise<MessageChunk> {
		const createdChunk = await messageChunks.create(chunkToCreate);

		return new MessageChunk(createdChunk.toObject());
	}
	async getById(chunkId: string): Promise<MessageChunk> {
		const foundChunk = await messageChunks.findById(chunkId);

		return new MessageChunk(foundChunk.toObject());
	}
	async getAll(): Promise<Array<MessageChunk>> {
		const chunks = await messageChunks.find();

		return chunks.map(messageChunk => new MessageChunk(messageChunk.toObject()));
	}
	async getAllByChatId(chatId: string): Promise<Array<MessageChunk>> {
		const chunks = await messageChunks.find({ chat: chatId });

		return chunks.map(messageChunk => new MessageChunk(messageChunk.toObject()));
	}
	async update(messageChunk: MessageChunk): Promise<MessageChunk> {
		const updatedChunk = await messageChunks.findByIdAndUpdate(messageChunk._id, messageChunk, {
			new: true,
		});

		return new MessageChunk(updatedChunk.toObject());
	}
	async pushMessageToChunk(chunkId: string, messageId: string): Promise<boolean> {
		const chunk = await messageChunks.findByIdAndUpdate(chunkId, { $push: { messages: messageId } }, { new: true });

		return !!chunk;
	}
	async dropMessageFromChunk(chunkId: string, messageId: string): Promise<boolean> {
		const chunk = await messageChunks.findByIdAndUpdate(chunkId, { $pull: { messages: messageId } }, { new: true });

		return !!chunk;
	}
	async delete(chunkId: string): Promise<boolean> {
		const deletedChunk = await messageChunks.findByIdAndDelete(chunkId);

		return !!deletedChunk;
	}
}
