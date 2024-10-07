import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { MessageRepository } from '../repositories/message-repository';
import { IMessageService } from '../types/services/IMessageService';
import { Message } from '../models/entities/Chat/Message';
import { CustomError } from '../types/error/CustomError';
import { MessageForCreate } from '../models/dtos/message/message-for-create';
import { Result } from '../types/result/Result';
import { DataResult } from '../types/result/DataResult';
import { User } from '../models/entities/User';
import { UserService } from './userService';
import { ChatService } from './chatService';
import { Chat } from '../models/entities/Chat/Chat';
import { MessageChunkService } from './messageChunkService';
import { MessageChunk } from '../models/entities/Chat/MessageChunk';
import { ObjectId } from '../types/ObjectId';

@injectable()
export class MessageService implements IMessageService {
	private readonly messageRepository: MessageRepository;
	private readonly userService: UserService;
	private readonly chatService: ChatService;
	private readonly messageChunkService: MessageChunkService;
	constructor(
		@inject(MessageRepository) messageRepository: MessageRepository,
		@inject(UserService) userService: UserService,
		@inject(ChatService) chatService: ChatService,
		@inject(MessageChunkService) messageChunkService: MessageChunkService
	) {
		this.messageRepository = messageRepository;
		this.userService = userService;
		this.chatService = chatService;
		this.messageChunkService = messageChunkService;
	}
	async createMessage(userId: string, messageToCreate: MessageForCreate, chatId: string): Promise<Result> {
		try {
			// Check if user exists
			const user: User = (await this.userService.getUserById(userId)).data;
			if (!user) return { success: false, message: 'User not found', statusCode: 404 } as Result;

			messageToCreate.creator = user._id;

			// Check if chat exists
			const chat: Chat = (await this.chatService.getChatById(chatId)).data;
			if (!chat) return { success: false, message: 'Chat not found', statusCode: 404 } as Result;

			messageToCreate.chatId = chat._id;

			// Check if chunk exists
			const chunk: MessageChunk = (await this.messageChunkService.getAllChunksByChatId(chat._id.toString())).data[0];
			// If chunk does not exist, create a new chunk
			if (!chunk) {
				const createdChunk: DataResult<MessageChunk> = await this.messageChunkService.createChunk({
					chat: chat._id.toString(),
					nextPartition: null,
				});
				if (!createdChunk.success) return { success: false, message: 'Chunk not found', statusCode: 404 } as Result;
				messageToCreate.chunkId = createdChunk.data._id;
			} else {
				messageToCreate.chunkId = chunk._id;
			}
			const createdMessage = await this.messageRepository.create(messageToCreate);

			const createdMessageChunk: DataResult<MessageChunk> = (
				await this.messageChunkService.pushMessageToChunk(
					messageToCreate.chunkId.toString(),
					createdMessage._id.toString()
				)
			);

			return {
				success: createdMessageChunk.success,
				message: createdMessageChunk.success ? 'Message created!' : 'Message creation failed!',
				statusCode: createdMessageChunk.success ? 200 : 404,
				data: createdMessageChunk.success ? createdMessage._id : null,
			} as Result;
		} catch (err) {
			const error: CustomError = new CustomError(err.message, err.status);
			error.className = err?.className ?? 'MessageService';
			error.functionName = err?.functionName ?? 'createMessage';
			throw error;
		}
	}
	async getMessage(messageId: string): Promise<DataResult<Message>> {
		try {
			const message: Message = await this.messageRepository.getById(messageId);
			if (!message)
				return { success: false, message: 'Message not found', statusCode: 404, data: null } as DataResult<Message>;

			return { success: true, message: 'Message found!', statusCode: 200, data: message } as DataResult<Message>;
		} catch (err) {
			const error: CustomError = new CustomError(err.message, err.status);
			error.className = err?.className ?? 'MessageService';
			error.functionName = err?.functionName ?? 'getMessage';
			throw error;
		}
	}
	async getAllMessagesByChatId(chatId: string): Promise<DataResult<Array<Message>>> {
		try {
			const chat: Chat = (await this.chatService.getChatById(chatId)).data;
			if (!chat)
				return { success: false, message: 'Chat not found', statusCode: 404, data: null } as DataResult<Array<Message>>;

			const messages: Array<Message> = await this.messageRepository.getAll({ chatId: chat._id });
			if (!messages)
				return { success: false, message: 'Messages not found', statusCode: 404, data: null } as DataResult<
					Array<Message>
				>;

			return { success: true, message: 'Messages found!', statusCode: 200, data: messages } as DataResult<
				Array<Message>
			>;
		} catch (err) {
			const error: CustomError = new CustomError(err.message, err.status);
			error.className = err?.className ?? 'MessageService';
			error.functionName = err?.functionName ?? 'getAllMessagesByChatId';
			throw error;
		}
	}
	getAllMessagesByChunkId(chunkId: string): Promise<DataResult<Array<Message>>> {
		throw new Error('Method not implemented.');
	}
	updateMessage(message: string): Promise<Result> {
		throw new Error('Method not implemented.');
	}
	pushMessageToChunk(messageId: string, chunkId: string): Promise<Result> {
		throw new Error('Method not implemented.');
	}
	dropMessageFromChunk(messageId: string, chunkId: string): Promise<Result> {
		throw new Error('Method not implemented.');
	}
	deleteMessage(messageId: string): Promise<Result> {
		throw new Error('Method not implemented.');
	}
	deleteAllMessagesByChatId(chatId: string): Promise<Result> {
		throw new Error('Method not implemented.');
	}
}
