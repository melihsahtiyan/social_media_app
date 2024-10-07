import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { Result } from '../types/result/Result';
import { DataResult } from '../types/result/DataResult';
import { CustomError } from '../types/error/CustomError';
import { ChatService } from './chatService';
import { Chat } from '../models/entities/Chat/Chat';
import { IMessageChunkService } from '../types/services/IMessageChunkService';
import { MessageChunkRepository } from '../repositories/message-chunk-repository';
import { MessageChunk } from '../models/entities/Chat/MessageChunk';
import { MessageChunkForCreate } from '../models/dtos/message-chunk/message-chunk-for-create';

@injectable()
export class MessageChunkService implements IMessageChunkService {
	private readonly messageChunkRepository: MessageChunkRepository;
	private readonly chatService: ChatService;
	constructor(
		@inject(MessageChunkRepository) messageChunkRepository: MessageChunkRepository,
		@inject(ChatService) chatService: ChatService
	) {
		this.messageChunkRepository = messageChunkRepository;
		this.chatService = chatService;
	}
	async createChunk(chunkToCreate: MessageChunkForCreate): Promise<DataResult<MessageChunk>> {
		try {
			const chat: Chat = (await this.chatService.getChatById(chunkToCreate.chat)).data;
			if (!chat) return { success: false, message: 'Chat not found', statusCode: 404 } as Result;

			const createdChunk: MessageChunk = await this.messageChunkRepository.create(chunkToCreate);

			const success: boolean = (await this.chatService.pushChunkToChat(chat._id.toString(), createdChunk._id)).success;

			if (!success)
				return { success: false, message: 'Push to chat failed!', statusCode: 404 } as DataResult<MessageChunk>;

			return {
				success: true,
				message: 'Chunk created successfully',
				data: createdChunk,
				statusCode: 201,
			} as DataResult<MessageChunk>;
		} catch (err) {
			const error: CustomError = new CustomError(err);
			error.className = err?.className || 'MessageChunkService';
			error.functionName = err?.functionName || 'createChunk';
			error.statusCode = err?.statusCode || 500;
			throw error;
		}
	}
	async getChunk(chunkId: string): Promise<DataResult<MessageChunk>> {
		try {
			const chunk: MessageChunk = await this.messageChunkRepository.getById(chunkId);

			if (!chunk)
				return { success: false, message: 'Chunk not found', statusCode: 404, data: null } as DataResult<MessageChunk>;

			return { success: true, message: 'Chunk found!', statusCode: 200, data: chunk } as DataResult<MessageChunk>;
		} catch (err) {
			const error: CustomError = new CustomError(err);
			error.className = err?.className || 'MessageChunkService';
			error.functionName = err?.functionName || 'getChunk';
			error.statusCode = err?.statusCode || 500;
			throw error;
		}
	}
	getAllChunks(): Promise<DataResult<Array<MessageChunk>>> {
		try {
			throw new Error('Method not implemented.');
		} catch (err) {
			const error: CustomError = new CustomError(err);
			error.className = err?.className || 'MessageChunkService';
			error.functionName = err?.functionName || 'getAllChunks';
			error.statusCode = err?.statusCode || 500;
			throw error;
		}
	}
	async getAllChunksByChatId(chatId: string): Promise<DataResult<Array<MessageChunk>>> {
		try {
			const chunks: Array<MessageChunk> = await this.messageChunkRepository.getAllByChatId(chatId);

			if (!chunks)
				return { success: false, message: 'Chunks not found', statusCode: 404, data: null } as DataResult<
					Array<MessageChunk>
				>;

			return { success: true, message: 'Chunks found!', statusCode: 200, data: chunks } as DataResult<
				Array<MessageChunk>
			>;
		} catch (err) {
			const error: CustomError = new CustomError(err);
			error.className = err?.className || 'MessageChunkService';
			error.functionName = err?.functionName || 'getAllChunksByChatId';
			error.statusCode = err?.statusCode || 500;
			throw error;
		}
	}
	// updateChunk(chunk: string): Promise<Result> {
	// 	throw new Error('Method not implemented.');
	// }

	async pushMessageToChunk(chunkId: string, messageId: string): Promise<DataResult<MessageChunk>> {
		try {
			const chunk: MessageChunk = await this.messageChunkRepository.getById(chunkId);
			if (!chunk)
				return { success: false, message: 'Chunk not found', statusCode: 404, data: null } as DataResult<MessageChunk>;

			const success: boolean = await this.messageChunkRepository.pushMessageToChunk(chunkId, messageId);

			return {
				success: success,
				message: success ? 'Message pushed to chunk!' : 'Push to chunk failed!',
				statusCode: success ? 200 : 404,
				data: success ? chunk : null,
			} as DataResult<MessageChunk>;
		} catch (err) {
			const error: CustomError = new CustomError(err);
			error.className = err?.className || 'MessageChunkService';
			error.functionName = err?.functionName || 'pushMessageToChunk';
			error.statusCode = err?.statusCode || 500;
			throw error;
		}
	}
	async dropMessageFromChunk(chunkId: string, messageId: string): Promise<DataResult<MessageChunk>> {
		try {
			const chunk: MessageChunk = await this.messageChunkRepository.getById(chunkId);
			if (!chunk)
				return { success: false, message: 'Chunk not found', statusCode: 404, data: null } as DataResult<MessageChunk>;

			const success: boolean = await this.messageChunkRepository.dropMessageFromChunk(chunkId, messageId);

			return {
				success: success,
				message: success ? 'Message dropped from chunk!' : 'Drop from chunk failed!',
				statusCode: success ? 200 : 404,
				data: success ? chunk : null,
			} as DataResult<MessageChunk>;
		} catch (err) {
			const error: CustomError = new CustomError(err);
			error.className = err?.className || 'MessageChunkService';
			error.functionName = err?.functionName || 'dropMessageFromChunk';
			error.statusCode = err?.statusCode || 500;
			throw error;
		}
	}
	// deleteChunk(chunkId: string): Promise<Result> {
	// 	throw new Error('Method not implemented.');
	// }
	// deleteAllChunksByChatId(chatId: string): Promise<Result> {
	// 	throw new Error('Method not implemented.');
	// }
}
