import { MessageChunkForCreate } from '../../models/dtos/message-chunk/message-chunk-for-create';
import { Message } from '../../models/entities/Chat/Message';
import { MessageChunk } from '../../models/entities/Chat/MessageChunk';
import { DataResult } from '../result/DataResult';

export interface IMessageChunkService {
	// Create Operation
	createChunk(chunkToCreate: MessageChunkForCreate): Promise<DataResult<MessageChunk>>;

	// Read Operations
	getChunk(userId: string, chunkId: string): Promise<DataResult<MessageChunk>>;
	getAllChunks(): Promise<DataResult<Array<MessageChunk>>>;
	getAllChunksByChatId(userId: string, chatId: string): Promise<DataResult<Array<MessageChunk>>>;

	// Update Operations
	// updateChunk(chunk: string): Promise<Result>;
	pushMessageToChunk(chunkId: string, message: Message): Promise<DataResult<MessageChunk>>;
	dropMessageFromChunk(chunkId: string, message: Message): Promise<DataResult<MessageChunk>>;

	// // Delete Operations
	// deleteChunk(chunkId: string): Promise<Result>;
	// deleteAllChunksByChatId(chatId: string): Promise<Result>;
}
