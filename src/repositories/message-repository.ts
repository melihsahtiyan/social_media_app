import 'reflect-metadata';
import { IMessageRepository } from '../types/repositories/IMessageRepository';
import { injectable } from 'inversify';
import { MessageForCreate } from '../models/dtos/message/message-for-create';
import { Message } from '../models/entities/Chat/Message';
import { MessageDoc, messages } from '../models/schemas/message.schema';

@injectable()
export class MessageRepository implements IMessageRepository {
	async create(messageForCreate: MessageForCreate): Promise<Message> {
		const createdMessage: MessageDoc = await messages.create(messageForCreate);

		return new Message(createdMessage.toObject());
	}
	async getById(messageId: string): Promise<Message> {
		const messageDoc: MessageDoc = await messages.findById(messageId);

		return new Message(messageDoc.toObject());
	}
	async getAll(filter: Partial<Message>): Promise<Array<Message>> {
		const allMessages: Array<MessageDoc> = await messages.find(filter);

		return allMessages.map(message => new Message(message.toObject()));
	}
	async update(message: Message): Promise<Message> {
		const updatedMessage = await messages.findByIdAndUpdate(message._id, message, { new: true });

		return new Message(updatedMessage.toObject());
	}
	async delete(messageId: string): Promise<boolean> {
		const deletedMessage: boolean = await messages.findByIdAndDelete(messageId);

		return !!deletedMessage;
	}
}
