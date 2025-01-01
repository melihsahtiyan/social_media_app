import { ChatForCreate } from '../../models/dtos/chat/chat-for-create';
import { Chat } from '../../models/entities/Chat/Chat';
import { ObjectId } from '../../types/ObjectId';
import { IRepositoryBase } from './IRepositoryBase';

export interface IChatRepository extends IRepositoryBase<Chat> {
	create(chat: ChatForCreate): Promise<boolean>;
	addMessageChunk(chatId: ObjectId, messageChunkId: ObjectId): Promise<boolean>;
	getByMembers(members: Array<string> | Array<ObjectId>): Promise<Chat>;
	getAllByUserId(userId: string): Promise<Array<Chat>>;

	addChunk(chatId: ObjectId, chunkId: ObjectId): Promise<Chat>;
	addMember(chatId: ObjectId, memberId: ObjectId): Promise<Chat>;
	removeMember(chatId: ObjectId, memberId: ObjectId): Promise<Chat>;
}
