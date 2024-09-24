import { ChatForCreate } from '@/models/dtos/chat/chat-for-create';
import { Chat } from '../../models/entities/Chat/Chat';

export interface IChatRepository {
	create(chat: ChatForCreate): Promise<Chat>;
	getById(chatId: string): Promise<Chat>;
	getAll(): Promise<Array<Chat>>;
	update(chat: Chat): Promise<Chat>;
	delete(chatId: string): Promise<boolean>;
}
