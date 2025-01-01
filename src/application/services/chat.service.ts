import 'reflect-metadata';
import { inject, injectable }	from 'inversify';
import { Result } 			 	from '../../types/result/Result';
import { DataResult } 		 	from '../../types/result/DataResult';
import { CustomError } 	 	 	from '../../types/error/CustomError';
import { ObjectId } 		 	from '../../types/ObjectId';
import { IChatRepository } 	 	from '../../persistence/abstracts/IChatRepository';
import { Chat } 			 	from '../../models/entities/Chat/Chat';
import { User } 			 	from '../../models/entities/User';
import { ChatForCreate } 	 	from '../../models/dtos/chat/chat-for-create';
import { ChatDetailDto } 	 	from '../../models/dtos/chat/chat-detail-dto';
import { ChatForUpdate } 	 	from '../../models/dtos/chat/chat-for-update';
import { ServiceIdentifiers }   from '../constants/ServiceIdentifiers';
import RepositoryIdentifiers 	from '../../persistence/constants/RepsitoryIdentifiers';
import IChatService from '../abstracts/IChatService';
import IUserService from '../abstracts/IUserService';
import { IFileUploadService } from '../abstracts/IFileUploadService';

@injectable()
export class ChatService implements IChatService {
	private chatRepository: IChatRepository;
	private userService: IUserService;
	private cloudinaryService: IFileUploadService;

	constructor(
		@inject(RepositoryIdentifiers.IChatRepository) chatRepository: IChatRepository,
		@inject(ServiceIdentifiers.IUserService) userService: IUserService,
		@inject(ServiceIdentifiers.IFileUploadService) cloudinaryService: IFileUploadService
	) {
		this.chatRepository = chatRepository;
		this.userService = userService;
		this.cloudinaryService = cloudinaryService;
	}

	async createChat(admin: string, members: string[]): Promise<Result> {
		try {
			const adminUser: User = (await this.userService.getUserById(admin)).data;

			// Check if users exist
			if (!adminUser) return { success: false, message: 'Creator not found', statusCode: 404 } as Result;

			if (members.length === 0) return { success: false, message: 'Members not found', statusCode: 404 } as Result;

			// Check if chat already exists
			const chatForCheck: Chat = await this.chatRepository.getByMembers(members);

			if (chatForCheck) return { success: false, message: 'Chat already exists', statusCode: 409 } as Result;

			// Check if all members are valid
			const allMembers: User[] = (await this.userService.getUsersByIds(members)).data;
			if (allMembers.length === 0) return { success: false, message: 'Members not found', statusCode: 404 } as Result;

			// Check if all members are friends with the admin
			let isFriend: boolean = true;
			allMembers.forEach(member => {
				const isFriendOrSameUniversity: boolean = adminUser.isFriendOrSameUniversity(member);
				if (!isFriendOrSameUniversity) isFriend = false;
			});

			if (!isFriend) return { success: false, message: 'Members are not friends', statusCode: 403 } as Result;

			const chatForCreate: ChatForCreate = {
				members: [...members, admin],
				isGroup: !!(members.length > 2),
				admins: [adminUser._id],
				title: null,
			};

			const createdChat: boolean = await this.chatRepository.create(chatForCreate);

			return {
				success: createdChat,
				message: createdChat ? 'Chat created successfully' : 'Chat creation failed',
				statusCode: createdChat ? 201 : 500,
			} as Result;
		} catch (err) {
			const error: CustomError = new Error(err);
			error.className = err.className || 'ChatService';
			error.functionName = err.functionName || 'createChat';
			throw error;
		}
	}
	async getAllChats(): Promise<DataResult<Chat[]>> {
		try {
			const allChats: Chat[] = await this.chatRepository.getAll({});

			if (allChats) {
				return { success: true, message: 'Chats fetched successfully!', data: allChats, statusCode: 201 } as DataResult<
					Chat[]
				>;
			}

			return { success: false, message: 'No chats found', statusCode: 404 } as DataResult<Chat[]>;
		} catch (err) {
			const error: CustomError = new Error(err);
			error.className = err.className || 'ChatService';
			error.functionName = err.functionName || 'createChat';
			throw error;
		}
	}
	async getChatById(chatId: string): Promise<DataResult<Chat>> {
		try {
			const chat: Chat = await this.chatRepository.get({ _id: chatId });

			if (chat) {
				return { success: true, data: chat, statusCode: 201 } as DataResult<Chat>;
			}

			return { success: false, message: 'Chat not found', statusCode: 404 } as DataResult<Chat>;
		} catch (err) {
			const error: CustomError = new Error(err);
			error.className = err.className || 'ChatService';
			error.functionName = err.functionName || 'createChat';
			throw error;
		}
	}
	async getAllChatsByUserId(userId: string): Promise<DataResult<Chat[]>> {
		try {
			const user: User = (await this.userService.getUserById(userId)).data;
			const allChats: Chat[] = await this.chatRepository.getAllByUserId(user._id.toString());

			if (allChats) {
				return { success: true, data: allChats, statusCode: 201 } as DataResult<Chat[]>;
			}

			return { success: false, message: 'No chats found', statusCode: 404 } as DataResult<Chat[]>;
		} catch (err) {
			const error: CustomError = new Error(err);
			error.className = err?.className || 'ChatService';
			error.functionName = err?.functionName || 'getAllChatsByUserId';
			throw error;
		}
	}
	async getChatDetails(chatId: string): Promise<DataResult<ChatDetailDto>> {
		try {
			const chat: Chat = await this.chatRepository.get({ _id: chatId });
			const adminUsers: User[] = (await this.userService.getUsersByIds(chat.admins.map(admin => admin.toString())))
				.data;

			if (chat) {
				const chatDetailDto: ChatDetailDto = {
					_id: chat._id,
					avatar: chat.avatar,
					description: chat.description,
					isGroup: chat.isGroup,
					title: chat.title,
					admins: adminUsers.map(admin => {
						return { _id: admin._id, firstName: admin.firstName, lastName: admin.lastName };
					}),
				};

				return { success: true, data: chatDetailDto, statusCode: 201 } as DataResult<ChatDetailDto>;
			}

			return { success: false, message: 'Chat not found', statusCode: 404 } as DataResult<ChatDetailDto>;
		} catch (err) {
			const error: CustomError = new Error(err);
			error.className = err.className || 'ChatService';
			error.functionName = err.functionName || 'createChat';
			throw error;
		}
	}
	async updateChat(userId: string, chatId: string, chat: ChatForUpdate): Promise<Result> {
		try {
			const user: User = (await this.userService.getUserById(userId)).data;

			if (!user) return { success: false, message: 'User not found', statusCode: 404 } as Result;

			const chatToUpdate: Chat = await this.chatRepository.get({ _id: chatId });

			if (!chatToUpdate) return { success: false, message: 'Chat not found', statusCode: 404 } as Result;

			if (!chatToUpdate.isMember(user._id))
				return { success: false, message: 'You are not a member of this chat', statusCode: 403 } as Result;

			await chatToUpdate.setGroupDetails({ isGroup: chat.isGroup, title: chat.title });
			await chatToUpdate.setDetails(chat.description);

			const isUpdated: boolean = await this.chatRepository.update(chatToUpdate._id.toString(), chatToUpdate);

			return {
				success: isUpdated,
				message: isUpdated ? 'Chat updated successfully' : 'Chat update failed',
				statusCode: isUpdated ? 200 : 500,
			} as Result;
		} catch (err) {
			const error: CustomError = new Error(err);
			error.className = err.className || 'ChatService';
			error.functionName = err.functionName || 'createChat';
			throw error;
		}
	}
	async pushChunkToChat(chatId: string, chunkId: ObjectId): Promise<Result> {
		try {
			const chat: Chat = await this.chatRepository.get({ _id: chatId });

			if (!chat) return { success: false, message: 'Chat not found', statusCode: 404 } as Result;

			const updatedChat: Chat = await this.chatRepository.addChunk(chat._id, chunkId);

			if (updatedChat)
				return { success: true, message: 'Chunk pushed to chat successfully', statusCode: 201 } as Result;

			return { success: false, message: 'Chunk push to chat failed', statusCode: 500 } as Result;
		} catch (err) {
			const error: CustomError = new Error(err);
			error.className = err.className || 'ChatService';
			error.functionName = err.functionName || 'createChat';
			throw error;
		}
	}
	async addChatMember(admin: string, chatId: string, memberId: string): Promise<Result> {
		try {
			const adminUser: User = (await this.userService.getUserById(admin)).data;
			const chat: Chat = await this.chatRepository.get({ _id: chatId });
			const member: User = (await this.userService.getUserById(memberId)).data;

			if (!adminUser) return { success: false, message: 'Admin not found', statusCode: 404 } as Result;
			if (!chat) return { success: false, message: 'Chat not found', statusCode: 404 } as Result;
			if (!member) return { success: false, message: 'Member not found', statusCode: 404 } as Result;

			if (!chat.isAdmin(adminUser._id))
				return { success: false, message: 'You are not an admin of this chat', statusCode: 403 } as Result;

			if (chat.isMember(member._id))
				return { success: false, message: 'User is already a member of this chat', statusCode: 403 } as Result;

			const updatedChat: Chat = await this.chatRepository.addMember(chat._id, member._id);

			if (updatedChat) {
				return { success: true, message: 'Member added successfully', statusCode: 201 } as Result;
			}

			return { success: false, message: 'Member addition failed', statusCode: 500 } as Result;
		} catch (err) {
			const error: CustomError = new Error(err);
			error.className = err.className || 'ChatService';
			error.functionName = err.functionName || 'createChat';
			throw error;
		}
	}
	async removeChatMember(admin: string, chatId: string, memberId: string): Promise<Result> {
		try {
			const adminUser: User = (await this.userService.getUserById(admin)).data;
			const chat: Chat = await this.chatRepository.get({ _id: chatId });
			const member: User = (await this.userService.getUserById(memberId)).data;

			if (!adminUser) return { success: false, message: 'Admin not found', statusCode: 404 } as Result;
			if (!chat) return { success: false, message: 'Chat not found', statusCode: 404 } as Result;
			if (!member) return { success: false, message: 'Member not found', statusCode: 404 } as Result;

			if (!chat.isAdmin(adminUser._id))
				return { success: false, message: 'You are not an admin of this chat', statusCode: 403 } as Result;

			if (!chat.isMember(member._id))
				return { success: false, message: 'User is not a member of this chat', statusCode: 403 } as Result;

			const updatedChat: Chat = await this.chatRepository.removeMember(chat._id, member._id);

			if (updatedChat) {
				return { success: true, message: 'Member removed successfully', statusCode: 201 } as Result;
			}

			return { success: false, message: 'Member removal failed', statusCode: 500 } as Result;
		} catch (err) {
			const error: CustomError = new Error(err);
			error.className = err.className || 'ChatService';
			error.functionName = err.functionName || 'createChat';
			throw error;
		}
	}
	async setChatAvatar(admin: string, chatId: string, avatar: Express.Multer.File): Promise<Result> {
		try {
			const adminUser: User = (await this.userService.getUserById(admin)).data;

			if (!adminUser) return { success: false, message: 'Admin not found', statusCode: 404 } as Result;

			// Check if chat exists
			const chat: Chat = await this.chatRepository.get({ _id: chatId });
			if (!chat) return { success: false, message: 'Chat not found', statusCode: 404 } as Result;

			// Check if admin is an admin of the chat
			if (!chat.isAdmin(adminUser._id))
				return { success: false, message: 'You are not an admin of this chat', statusCode: 403 } as Result;

			// If chat has an avatar, delete it
			if (chat.avatar) await this.cloudinaryService.handleDelete(chat.avatar);
			// Set new avatar
			await chat.setAvatar(await this.cloudinaryService.handleUpload(avatar, 'avatar'));

			// Check if avatar upload is successful
			if (!chat.avatar) return { success: false, message: 'Avatar upload failed', statusCode: 500 } as Result;

			// Update chat
			const isUpdated: boolean = await this.chatRepository.update(chat._id.toString(), chat);

			return {
				success: isUpdated,
				message: isUpdated ? 'Avatar setting successful' : 'Avatar setting failed',
				statusCode: isUpdated ? 200 : 500,
			} as Result;
		} catch (err) {
			const error: CustomError = new Error(err);
			error.className = err.className || 'ChatService';
			error.functionName = err.functionName || 'createChat';
			throw error;
		}
	}
	async deleteChat(admin: string, chatId: string): Promise<Result> {
		try {
			const adminUser: User = (await this.userService.getUserById(admin)).data;
			if (!adminUser) return { success: false, message: 'Admin not found', statusCode: 404 } as Result;

			const chat: Chat = await this.chatRepository.get({ _id: chatId });
			if (!chat) return { success: false, message: 'Chat not found', statusCode: 404 } as Result;

			if (!chat.isAdmin(adminUser._id))
				return { success: false, message: 'You are not authorized to delete this chat', statusCode: 403 } as Result;

			if (chat.avatar) {
				if (!(await this.cloudinaryService.handleDelete(chat.avatar)))
					return { success: false, message: 'Chat avatar deletion failed', statusCode: 500 } as Result;
			}

			// TODO: delete media files
			// TODO: delete message chunks

			const deletedChat: boolean = await this.chatRepository.delete(chatId);

			return {
				success: deletedChat,
				message: deletedChat ? 'Chat deleted successfully' : 'Chat deletion failed',
				statusCode: deletedChat ? 200 : 500,
			} as Result;
		} catch (err) {
			const error: CustomError = new Error(err);
			error.className = err.className || 'ChatService';
			error.functionName = err.functionName || 'createChat';
			throw error;
		}
	}
}
