import { MessageForCreate } from '../../models/dtos/message/message-for-create';
import { Message } from '../../models/entities/Chat/Message';
import { DataResult } from '../../types/result/DataResult';
import { Result } from '../../types/result/Result';
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
	getAllMessagesByChatId(userId: string, chatId: string): Promise<DataResult<Array<Message>>>;
	getAllMessagesByChunkId(userId: string, chunkId: string): Promise<DataResult<Array<Message>>>;
	// Update Operations
	updateMessage(userId: string, messageId: string, message: Partial<Message>): Promise<Result>;

	// Delete Operations
	deleteMessage(userId: string, messageId: string): Promise<Result>;
	deleteAllMessagesByChatId(userId: string, chatId: string): Promise<Result>;
}
