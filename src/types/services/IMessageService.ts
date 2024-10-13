import { MessageForCreate } from '../../models/dtos/message/message-for-create';
import { Message } from '../../models/entities/Chat/Message';
import { DataResult } from '../result/DataResult';
import { Result } from '../result/Result';

export interface IMessageService {
	// Create Operation
	createMessage(
		userId: string,
		messageToCreate: MessageForCreate,
		chatId: string,
		media?: Express.Multer.File
	): Promise<Result>;

	// Read Operations
	getMessage(messageId: string): Promise<DataResult<Message>>;
	getAllMessagesByChatId(chatId: string): Promise<DataResult<Array<Message>>>;
	getAllMessagesByChunkId(chunkId: string): Promise<DataResult<Array<Message>>>;
	// Update Operations
	updateMessage(userId: string, messageId: string, message: Partial<Message>): Promise<Result>;
	pushMessageToChunk(messageId: string, chunkId: string): Promise<Result>;
	dropMessageFromChunk(messageId: string, chunkId: string): Promise<Result>;

	// Delete Operations
	deleteMessage(messageId: string): Promise<Result>;
	deleteAllMessagesByChatId(chatId: string): Promise<Result>;
}
