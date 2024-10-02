import { Chat } from '../../models/entities/Chat/Chat';
import { DataResult } from '../result/DataResult';
import { Result } from '../result/Result';
import { ChatDetailDto } from '../../models/dtos/chat/chat-detail-dto';
import { ChatForUpdate } from '../../models/dtos/chat/chat-for-update';

export interface IChatService {
	// Create Operation
	createChat(admin: string, members: Array<string>): Promise<Result>;

	// Read Operations
	getAllChats(): Promise<DataResult<Array<Chat>>>;
	getChatById(chatId: string): Promise<DataResult<Chat>>;
	getChatDetails(chatId: string): Promise<DataResult<ChatDetailDto>>;

	// Update Operations
	updateChat(userId: string, chatId: string, chat: ChatForUpdate): Promise<Result>;
	//Update members
	addChatMember(chatId: string, memberId: string): Promise<Result>;
	removeChatMember(chatId: string, memberId: string): Promise<Result>;
	// Update details
	setChatAvatar(chatId: string, avatar: Express.Multer.File): Promise<Result>;
	setDescription(chatId: string, description: string): Promise<Result>;

	// Delete Operations
	deleteChat(chatId: string): Promise<Result>;
}
