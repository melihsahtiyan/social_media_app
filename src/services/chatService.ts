import 'reflect-metadata';
import { IChatService } from '../types/services/IChatService';
import { inject, injectable } from 'inversify';
import { ChatRepository } from '../repositories/chat-repository';
import { Chat } from '../models/entities/Chat/Chat';
import { DataResult } from '../types/result/DataResult';
import { Result } from '../types/result/Result';
import { ChatForCreate } from '../models/dtos/chat/chat-for-create';
import { User } from '../models/entities/User';
import { CustomError } from '../types/error/CustomError';
import { ChatDetailDto } from '../models/dtos/chat/chat-detail-dto';
import { UserService } from './userService';
import { CloudinaryService } from './cloudinaryService';

@injectable()
export class ChatService implements IChatService {
	private chatRepository: ChatRepository;
	private userService: UserService;
	private cloudinaryService: CloudinaryService;

	constructor(
		@inject(ChatRepository) chatRepository: ChatRepository,
		@inject(UserService) userService: UserService,
		@inject(CloudinaryService) cloudinaryService: CloudinaryService
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

			const createdChat: Chat = await this.chatRepository.create(chatForCreate);

			if (createdChat) {
				return { success: true, message: 'Chat created successfully', statusCode: 200 } as Result;
			}

			return { success: false, message: 'Chat creation failed', statusCode: 500 } as Result;
		} catch (err) {
			const error: CustomError = new Error(err);
			error.className = err.className || 'ChatService';
			error.functionName = err.functionName || 'createChat';
			throw error;
		}
	}
	async getAllChats(): Promise<DataResult<Chat[]>> {
		try {
			const allChats: Chat[] = await this.chatRepository.getAll();

			if (allChats) {
				return { success: true, data: allChats } as DataResult<Chat[]>;
			}

			return { success: false, message: 'No chats found' } as DataResult<Chat[]>;
		} catch (err) {
			const error: CustomError = new Error(err);
			throw error;
		}
	}
	async getChatById(chatId: string): Promise<DataResult<Chat>> {
		try {
			const chat: Chat = await this.chatRepository.getById(chatId);

			if (chat) {
				return { success: true, data: chat } as DataResult<Chat>;
			}

			return { success: false, message: 'Chat not found' } as DataResult<Chat>;
		} catch (err) {
			const error: CustomError = new Error(err);
			throw error;
		}
	}

	async getChatDetails(chatId: string): Promise<DataResult<ChatDetailDto>> {
		try {
			const chat: Chat = await this.chatRepository.getById(chatId);
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

				return { success: true, data: chatDetailDto } as DataResult<ChatDetailDto>;
			}

			return { success: false, message: 'Chat not found' } as DataResult<ChatDetailDto>;
		} catch (err) {
			const error: CustomError = new Error(err);
			throw error;
		}
	}
	async updateChat(userId: string, chatId: string, chat: Chat): Promise<Result> {
		try {
			const user: User = (await this.userService.getUserById(userId)).data;

			if (!user) return { success: false, message: 'User not found' } as Result;

			const chatToUpdate: Chat = await this.chatRepository.getById(chatId);

			if (!chatToUpdate) return { success: false, message: 'Chat not found' } as Result;

			const isMember: boolean = chatToUpdate.members.includes(user._id);

			if (!isMember) return { success: false, message: 'You are not a member of this chat' } as Result;

			const updatedChat: Chat = await this.chatRepository.update(chat);

			if (updatedChat) {
				return { success: true, message: 'Chat updated successfully' } as Result;
			}

			return { success: false, message: 'Chat update failed' } as Result;
		} catch (err) {
			const error: CustomError = new Error(err);
			throw error;
		}
	}
	async addChatMember(chatId: string, memberId: string): Promise<Result> {
		try {
			const chat: Chat = await this.chatRepository.getById(chatId);
			const member: User = (await this.userService.getUserById(memberId)).data;

			if (!chat) return { success: false, message: 'Chat not found' } as Result;
			if (!member) return { success: false, message: 'Member not found' } as Result;

			const isMember: boolean = chat.members.includes(member._id);

			if (isMember) return { success: false, message: 'User is already a member of this chat' } as Result;

			const updatedChat: Chat = await this.chatRepository.addMember(chat._id, member._id);

			if (updatedChat) {
				return { success: true, message: 'Member added successfully' } as Result;
			}

			return { success: false, message: 'Member addition failed' } as Result;
		} catch (err) {
			const error: CustomError = new Error(err);
			throw error;
		}
	}
	async removeChatMember(chatId: string, memberId: string): Promise<Result> {
		try {
			const chat: Chat = await this.chatRepository.getById(chatId);
			const member: User = (await this.userService.getUserById(memberId)).data;

			if (!chat) return { success: false, message: 'Chat not found' } as Result;
			if (!member) return { success: false, message: 'Member not found' } as Result;

			const isMember: boolean = chat.members.includes(member._id);

			if (!isMember) return { success: false, message: 'User is not a member of this chat' } as Result;

			const updatedChat: Chat = await this.chatRepository.removeMember(chat._id, member._id);

			if (updatedChat) {
				return { success: true, message: 'Member removed successfully' } as Result;
			}

			return { success: false, message: 'Member removal failed' } as Result;
		} catch (err) {
			const error: CustomError = new Error(err);
			throw error;
		}
	}
	async setChatAvatar(chatId: string, avatar: Express.Multer.File): Promise<Result> {
		try {
			const chat: Chat = await this.chatRepository.getById(chatId);
			if (!chat) return { success: false, message: 'Chat not found' } as Result;

			await chat.setAvatar(await this.cloudinaryService.handleUpload(avatar, 'avatar'));

			if (!chat.avatar) return { success: false, message: 'Avatar upload failed' } as Result;

			const updatedChat: Chat = await this.chatRepository.update(chat);

			if (updatedChat) {
				return { success: true, message: 'Avatar set successfully' } as Result;
			}

			return { success: false, message: 'Avatar setting failed' } as Result;
		} catch (err) {
			const error: CustomError = new Error(err);
			throw error;
		}
	}
	async setDescription(chatId: string, description: string): Promise<Result> {
		try {
			const chat: Chat = await this.chatRepository.getById(chatId);
			if (!chat) return { success: false, message: 'Chat not found' } as Result;

			chat.description = description;

			const updatedChat: Chat = await this.chatRepository.update(chat);

			if (updatedChat) {
				return { success: true, message: 'Description set successfully' } as Result;
			}

			return { success: false, message: 'Description setting failed' } as Result;
		} catch (err) {
			const error: CustomError = new Error(err);
			throw error;
		}
	}
	async deleteChat(chatId: string): Promise<Result> {
		try {
			const chat: Chat = await this.chatRepository.getById(chatId);

			if (!chat) return { success: false, message: 'Chat not found' } as Result;

			const isDeleted: boolean = await this.cloudinaryService.handleDelete(chat.avatar);

			// TODO: delete media files
			// TODO: delete message chunks

			if (!isDeleted) return { success: false, message: 'Chat avatar deletion failed' } as Result;

			const deletedChat: boolean = await this.chatRepository.delete(chatId);

			if (deletedChat) {
				return { success: true, message: 'Chat deleted successfully' } as Result;
			}

			return { success: false, message: 'Chat deletion failed' } as Result;
		} catch (err) {
			const error: CustomError = new Error(err);
			throw error;
		}
	}
}
