import { Message } from '../../models/entities/Chat/Message';
import { ObjectId } from '../ObjectId';

export interface IMessageService {
	// Create Operation
	createMessage(messageToCreate: string): Promise<ObjectId>;

	// Read Operations
	getMessage(messageId: string): Promise<Message>;
	getAllMessagesByChatId(chatId: string): Promise<Array<Message>>;

	// Update Operations
	updateMessage(message: string): Promise<Message>;
	pushMessageToChunk(messageId: string, chunkId: string): Promise<Message>;
	dropMessageFromChunk(messageId: string, chunkId: string): Promise<Message>;

	// Delete Operations
	deleteMessage(messageId: string): Promise<boolean>;
	deleteAllMessagesByChatId(chatId: string): Promise<boolean>;
}
