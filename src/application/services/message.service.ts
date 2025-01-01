import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { Message } from '../../models/entities/Chat/Message';
import { CustomError } from '../../types/error/CustomError';
import { MessageForCreate } from '../../models/dtos/message/message-for-create';
import { Result } from '../../types/result/Result';
import { DataResult } from '../../types/result/DataResult';
import { User } from '../../models/entities/User';
import { Chat } from '../../models/entities/Chat/Chat';
import { MessageChunk } from '../../models/entities/Chat/MessageChunk';
import { IMessageRepository } from '../../persistence/abstracts/IMessageRepository';
import { MessageStatus, MessageTypes } from '../../models/entities/enums/messageEnums';
import { ServiceIdentifiers } from '../constants/ServiceIdentifiers';
import RepositoryIdentifiers from '../../persistence/constants/RepsitoryIdentifiers';
import { IMessageService } from '../abstracts/IMessageService';
import IUserService from '../abstracts/IUserService';
import IChatService from '../abstracts/IChatService';
import { IMessageChunkService } from '../abstracts/IMessageChunkService';
import { IFileUploadService } from '../abstracts/IFileUploadService';

@injectable()
export class MessageService implements IMessageService {
	private readonly messageRepository: IMessageRepository;
	private readonly userService: IUserService;
	private readonly chatService: IChatService;
	private readonly messageChunkService: IMessageChunkService;
	private readonly cloudinaryService: IFileUploadService;
	constructor(
		@inject(RepositoryIdentifiers.IMessageRepository) messageRepository: IMessageRepository,
		@inject(ServiceIdentifiers.IUserService) userService: IUserService,
		@inject(ServiceIdentifiers.IChatService) chatService: IChatService,
		@inject(ServiceIdentifiers.IMessageChunkService) messageChunkService: IMessageChunkService,
		@inject(ServiceIdentifiers.IFileUploadService) cloudinaryService: IFileUploadService
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

			if (!chat.isMember(user._id))
				return {
					success: false,
					message: 'You are not a member of this chat',
					statusCode: 403,
				} as Result;

			messageToCreate.chatId = chat._id;

			// Check if chunk exists
			const chunk: MessageChunk = (await this.messageChunkService.getChunk(userId, chat.getActiveChunk()?.toString()))
				.data;

			// If chunk does not exist or is full, create a new chunk
			if (!chunk || chunk.isFull) {
				const createdChunk: MessageChunk = (
					await this.messageChunkService.createChunk({
						chat: chat._id.toString(),
						nextChunk: null,
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

			messageToCreate.statuses = chat.members.map(member => ({ status: MessageStatus.SENT, userId: member }));

			const createdMessage = await this.messageRepository.createMessage(messageToCreate);

			const pushedMessageChunk: DataResult<MessageChunk> = await this.messageChunkService.pushMessageToChunk(
				messageToCreate.chunkId.toString(),
				createdMessage
			);

			return {
				success: pushedMessageChunk.success,
				message: pushedMessageChunk.success ? 'Message created!' : 'Message creation failed!',
				statusCode: pushedMessageChunk.success ? 200 : 404,
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
			const message: Message = await this.messageRepository.get({ _id: messageId, isDeleted: false });
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
	async getAllMessagesByChatId(userId: string, chatId: string): Promise<DataResult<Array<Message>>> {
		try {
			const user: User = (await this.userService.getUserById(userId)).data;
			if (!user)
				return { success: false, message: 'User not found', statusCode: 404, data: null } as DataResult<Array<Message>>;

			const chat: Chat = (await this.chatService.getChatById(chatId)).data;

			if (!chat)
				return { success: false, message: 'Chat not found', statusCode: 404, data: null } as DataResult<Array<Message>>;

			if (!chat.isMember(user._id))
				return {
					success: false,
					message: 'You are not a member of this chat',
					statusCode: 403,
					data: null,
				} as DataResult<Array<Message>>;

			const messages: Array<Message> = await this.messageRepository.getAll({ chatId: chat._id, isDeleted: false });
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
	async getAllMessagesByChunkId(userId: string, chunkId: string): Promise<DataResult<Array<Message>>> {
		try {
			const user: User = (await this.userService.getUserById(userId)).data;
			if (!user)
				return { success: false, message: 'User not found', statusCode: 404, data: null } as DataResult<Array<Message>>;

			const getChunk = await this.messageChunkService.getChunk(userId, chunkId);
			if (!getChunk.success)
				return {
					success: getChunk.success,
					message: getChunk.message,
					statusCode: getChunk.statusCode,
					data: null,
				} as DataResult<Array<Message>>;

			const chunk: MessageChunk = getChunk.data;

			const chat: Chat = (await this.chatService.getChatById(chunk.chat.toString())).data;
			if (!chat)
				return { success: false, message: 'Chat not found', statusCode: 404, data: null } as DataResult<Array<Message>>;

			if (!chat.isMember(user._id))
				return {
					success: false,
					message: 'You are not a member of this chat',
					statusCode: 403,
					data: null,
				} as DataResult<Array<Message>>;

			const messages: Array<Message> = await this.messageRepository.getAll({ chunkId: chunk._id, isDeleted: false });

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
	async updateMessage(userId: string, messageId: string, message: Partial<Message>): Promise<Result> {
		try {
			const user: User = (await this.userService.getUserById(userId)).data;
			if (!user) return { success: false, message: 'User not found', statusCode: 404 } as Result;

			const fetchedMessage: Message = (await this.getMessage(messageId)).data;
			if (!fetchedMessage) return { success: false, message: 'Message not found', statusCode: 404 } as Result;

			if (fetchedMessage.isEditable(user._id)) {
				fetchedMessage.editMessage(message.content);
				const updatedMessage: boolean = await this.messageRepository.update(messageId, fetchedMessage);

				return {
					success: updatedMessage,
					message: updatedMessage ? 'Message updated!' : 'Message update failed!',
					statusCode: updatedMessage ? 200 : 404,
				} as Result;
			}

			return { success: false, message: 'You are not allowed to update this message', statusCode: 403 } as Result;
		} catch (err) {
			const error: CustomError = new CustomError(err.message, err.status);
			error.className = err?.className ?? 'MessageService';
			error.functionName = err?.functionName ?? 'updateMessage';
			throw error;
		}
	}
	async deleteMessage(userId: string, messageId: string): Promise<Result> {
		try {
			const user: User = (await this.userService.getUserById(userId)).data;
			if (!user) return { success: false, message: 'User not found', statusCode: 404 } as Result;

			const message: Message = (await this.getMessage(messageId)).data;
			if (!message) return { success: false, message: 'Message not found', statusCode: 404 } as Result;

			if (message.creator.toString() !== user._id.toString())
				return { success: false, message: 'You are not allowed to delete this message', statusCode: 403 } as Result;

			message.deleteMessage();
			const updatedMessage: boolean = await this.messageRepository.update(messageId, message);

			return {
				success: updatedMessage,
				message: updatedMessage ? 'Message deleted!' : 'Message deletion failed!',
				statusCode: updatedMessage ? 200 : 404,
			} as Result;
		} catch (err) {
			const error: CustomError = new CustomError(err.message, err.status);
			error.className = err?.className ?? 'MessageService';
			error.functionName = err?.functionName ?? 'deleteMessage';
			throw error;
		}
	}
	async deleteAllMessagesByChatId(userId: string, chatId: string): Promise<Result> {
		throw new Error('Method not implemented.');
	}
}
