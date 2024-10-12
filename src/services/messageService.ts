import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { IMessageService } from '../types/services/IMessageService';
import { Message } from '../models/entities/Chat/Message';
import { CustomError } from '../types/error/CustomError';
import { MessageForCreate } from '../models/dtos/message/message-for-create';
import { Result } from '../types/result/Result';
import { DataResult } from '../types/result/DataResult';
import { User } from '../models/entities/User';
import { Chat } from '../models/entities/Chat/Chat';
import { MessageChunk } from '../models/entities/Chat/MessageChunk';
import IChatService from '../types/services/IChatService';
import TYPES from '../util/ioc/types';
import { IMessageRepository } from '../types/repositories/IMessageRepository';
import IUserService from '../types/services/IUserService';
import { IMessageChunkService } from '../types/services/IMessageChunkService';
import { ICloudinaryService } from '../types/services/ICloudinaryService';
import { MessageTypes } from '../models/entities/enums/messageEnums';

@injectable()
export class MessageService implements IMessageService {
	private readonly messageRepository: IMessageRepository;
	private readonly userService: IUserService;
	private readonly chatService: IChatService;
	private readonly messageChunkService: IMessageChunkService;
	private readonly cloudinaryService: ICloudinaryService;
	constructor(
		@inject(TYPES.IMessageRepository) messageRepository: IMessageRepository,
		@inject(TYPES.IUserService) userService: IUserService,
		@inject(TYPES.IChatService) chatService: IChatService,
		@inject(TYPES.IMessageChunkService) messageChunkService: IMessageChunkService,
		@inject(TYPES.ICloudinaryService) cloudinaryService: ICloudinaryService
	) {
		this.messageRepository = messageRepository;
		this.userService = userService;
		this.chatService = chatService;
		this.messageChunkService = messageChunkService;
		this.cloudinaryService = cloudinaryService;
	}
	async createMessage(
		userId: string,
		messageToCreate: MessageForCreate,
		chatId: string,
		media?: Express.Multer.File
	): Promise<Result> {
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
			const chunk: MessageChunk = (await this.messageChunkService.getAllChunksByChatId(chatId)).data[0];
			
			// If chunk does not exist, create a new chunk
			if (!chunk) {
				const createdChunk: MessageChunk = (
					await this.messageChunkService.createChunk({
						chat: chat._id.toString(),
						nextChunk: null,
					})
				).data;

				if (!createdChunk) return { success: false, message: 'Chunk not found', statusCode: 404 } as Result;
				messageToCreate.chunkId = createdChunk._id;
			}
			// If chunk is full, create a new chunk
			else if (chunk.isFull) {
				const createdChunk: MessageChunk = (
					await this.messageChunkService.createChunk({
						chat: chat._id.toString(),
						nextChunk: chunk._id.toString(),
					})
				).data;

				if (!createdChunk) return { success: false, message: 'Chunk not found', statusCode: 404 } as Result;
				
				messageToCreate.chunkId = createdChunk._id;
			} else {
				messageToCreate.chunkId = chunk._id;
			}

			// Check the message type and upload media to cloudinary
			if (messageToCreate.type === MessageTypes.MEDIA || media) {
				const uploadedMedia = await this.cloudinaryService.handleUpload(media, 'messages');
				messageToCreate.content = uploadedMedia;
				messageToCreate.type = MessageTypes.MEDIA;
			}

			const createdMessage = await this.messageRepository.create(messageToCreate);

			const pushedMessageChunk: DataResult<MessageChunk> = await this.messageChunkService.pushMessageToChunk(
				messageToCreate.chunkId.toString(),
				createdMessage
			);

			return {
				success: pushedMessageChunk.success,
				message: pushedMessageChunk.success ? 'Message created!' : 'Message creation failed!',
				statusCode: pushedMessageChunk.success ? 200 : 404,
				data: pushedMessageChunk.success ? createdMessage._id : null,
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
	async getAllMessagesByChunkId(chunkId: string): Promise<DataResult<Array<Message>>> {
		try {
			const chunk: MessageChunk = (await this.messageChunkService.getChunk(chunkId)).data;

			if (!chunk)
				return { success: false, message: 'Chunk not found', statusCode: 404, data: null } as DataResult<
					Array<Message>
				>;

			const messages: Array<Message> = await this.messageRepository.getAll({ chunkId: chunk._id });

			return { success: true, message: 'Messages found!', statusCode: 200, data: messages } as DataResult<
				Array<Message>
			>;
		} catch (err) {
			const error: CustomError = new CustomError(err.message, err.status);
			error.className = err?.className ?? 'MessageService';
			error.functionName = err?.functionName ?? 'getAllMessagesByChunkId';
			throw error;
		}
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
