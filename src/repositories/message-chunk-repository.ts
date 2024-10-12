import 'reflect-metadata';
import { MessageChunk } from '../models/entities/Chat/MessageChunk';
import { messageChunks } from '../models/schemas/message.chunk.schema';
import { IMessageChunkRepository } from '../types/repositories/IMessageChunkRepository';
import { injectable } from 'inversify';
import { RepositoryBase } from './repository-base';
import { MessageChunkForCreate } from '../models/dtos/message-chunk/message-chunk-for-create';

@injectable()
export class MessageChunkRepository extends RepositoryBase<MessageChunk> implements IMessageChunkRepository {
	constructor() {
		super(messageChunks);
	}
	async createChunk(createDto: MessageChunkForCreate): Promise<MessageChunk> {
		const createdChunk = await this.model.create(createDto);

		return new MessageChunk(createdChunk.toObject());
	}
	async getById(chunkId: string): Promise<MessageChunk> {
		const foundChunk = await this.model.findById(chunkId);

		return new MessageChunk(foundChunk.toObject());
	}
	async getAll(): Promise<Array<MessageChunk>> {
		const chunks = await this.model.find();

		return chunks.map(messageChunk => new MessageChunk(messageChunk.toObject()));
	}
	async getAllByChatId(chatId: string): Promise<Array<MessageChunk>> {
		const chunks = await this.model.find({ chat: chatId });

		return chunks.map(messageChunk => new MessageChunk(messageChunk.toObject()));
	}
	async pushMessageToChunk(chunkId: string, messageId: string): Promise<boolean> {
		const chunk = await this.model.findByIdAndUpdate(chunkId, { $push: { messages: messageId } }, { new: true });

		return !!chunk;
	}
	async dropMessageFromChunk(chunkId: string, messageId: string): Promise<boolean> {
		const chunk = await this.model.findByIdAndUpdate(chunkId, { $pull: { messages: messageId } }, { new: true });

		return !!chunk;
	}
}
