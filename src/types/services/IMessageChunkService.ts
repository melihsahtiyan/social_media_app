import { MessageChunk } from '../../models/entities/Chat/MessageChunk';
import { ObjectId } from '../ObjectId';

export interface IMessageChunkService {
	// Create Operation
	createChunk(chunkToCreate: string): Promise<ObjectId>;

	// Read Operations
	getChunk(chunkId: string): Promise<MessageChunk>;
	getAllChunks(): Promise<Array<MessageChunk>>;
	getAllChunksByChatId(chatId: string): Promise<Array<MessageChunk>>;

	// Update Operations
	updateChunk(chunk: string): Promise<MessageChunk>;
	pushMessageToChunk(chunkId: string, messageId: string): Promise<MessageChunk>;
	dropMessageFromChunk(chunkId: string, messageId: string): Promise<MessageChunk>;

	// Delete Operations
	deleteChunk(chunkId: string): Promise<boolean>;
	deleteAllChunksByChatId(chatId: string): Promise<boolean>;
}
