import { MessageChunkForCreate } from '../../models/dtos/message-chunk/message-chunk-for-create';
import { MessageChunk } from '../../models/entities/Chat/MessageChunk';
import { IRepositoryBase } from './IRepositoryBase';

export interface IMessageChunkRepository extends IRepositoryBase<MessageChunk> {
	createChunk(createDto: MessageChunkForCreate): Promise<MessageChunk>;
	getAllByChatId(chatId: string): Promise<Array<MessageChunk>>;
	pushMessageToChunk(chunkId: string, messageId: string): Promise<boolean>;
	dropMessageFromChunk(chunkId: string, messageId: string): Promise<boolean>;
	delete(chunkId: string): Promise<boolean>;
}
