import { ChatForCreate } from '../../models/dtos/chat/chat-for-create';
import { Chat } from '../../models/entities/Chat/Chat';
import { ObjectId } from '../ObjectId';

export interface IChatRepository {
	create(chat: ChatForCreate): Promise<Chat>;
	addMessageChunk(chatId: ObjectId, messageChunkId: ObjectId): Promise<Chat>;
	getById(chatId: string): Promise<Chat>;
	getByMembers(members: Array<string> | Array<ObjectId>): Promise<Chat>;
	getAll(filter?: Partial<Chat>): Promise<Array<Chat>>;
	getAllByUserId(userId: string): Promise<Array<Chat>>;
	update(chat: Chat): Promise<Chat>;
	addChunk(chatId: ObjectId, chunkId: ObjectId): Promise<Chat>;
	addMember(chatId: ObjectId, memberId: ObjectId): Promise<Chat>;
	removeMember(chatId: ObjectId, memberId: ObjectId): Promise<Chat>;
	delete(chatId: string): Promise<boolean>;
}
