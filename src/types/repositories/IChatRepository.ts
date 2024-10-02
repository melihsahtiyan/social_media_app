import { ChatForCreate } from '../../models/dtos/chat/chat-for-create';
import { Chat } from '../../models/entities/Chat/Chat';
import { ObjectId } from '../ObjectId';

export interface IChatRepository {
	create(chat: ChatForCreate): Promise<Chat>;
	getById(chatId: string): Promise<Chat>;
	getByMembers(members: Array<string> | Array<ObjectId>): Promise<Chat>;
	getAll(): Promise<Array<Chat>>;
	update(chat: Chat): Promise<Chat>;
	addMember(chatId: ObjectId, memberId: ObjectId): Promise<Chat>;
	removeMember(chatId: ObjectId, memberId: ObjectId): Promise<Chat>;
	delete(chatId: string): Promise<boolean>;
}
