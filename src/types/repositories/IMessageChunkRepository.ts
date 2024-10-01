import { MessageChunkForCreate } from '../../models/dtos/message-chunk/message-chunk-for-create';
import { MessageChunk } from '../../models/entities/Chat/MessageChunk';

export interface IMessageChunkRepository {
	create(chunkToCreate: MessageChunkForCreate): Promise<MessageChunk>;
	getById(chunkId: string): Promise<MessageChunk>;
	getAll(): Promise<Array<MessageChunk>>;
	update(messageChunk: MessageChunk): Promise<MessageChunk>;
	delete(chunkId: string): Promise<boolean>;
}
