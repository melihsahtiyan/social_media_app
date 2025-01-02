import { Chat } from '../../models/entities/Chat/Chat';
import { DataResult } from '../../types/result/DataResult';
import { Result } from '../../types/result/Result';
import { ChatDetailDto } from '../../models/dtos/chat/chat-detail-dto';
import { ChatForUpdate } from '../../models/dtos/chat/chat-for-update';
import { ObjectId } from '../../types/ObjectId';

export default interface IChatService {
	// Create Operation
	createChat(admin: string, members: Array<string>): Promise<Result>;

	// Read Operations
	getAllChats(): Promise<DataResult<Array<Chat>>>;
	getChatById(chatId: string): Promise<DataResult<Chat>>;
	getAllChatsByUserId(userId: string): Promise<DataResult<Chat[]>>;
	getChatDetails(chatId: string): Promise<DataResult<ChatDetailDto>>;

	// Update Operations
	updateChat(userId: string, chatId: string, chat: ChatForUpdate): Promise<Result>;
	pushChunkToChat(chatId: string, chunkId: ObjectId): Promise<Result>;
	//Update members
	addChatMember(admin: string, chatId: string, memberId: string): Promise<Result>;
	removeChatMember(admin: string, chatId: string, memberId: string): Promise<Result>;
	// Update details
	setChatAvatar(admin: string, chatId: string, avatar: Express.Multer.File): Promise<Result>;

	// Delete Operations
	deleteChat(admin: string, chatId: string): Promise<Result>;
}
