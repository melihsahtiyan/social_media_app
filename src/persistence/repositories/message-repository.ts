import 'reflect-metadata';
import { IMessageRepository } from '../abstracts/IMessageRepository';
import { injectable } from 'inversify';
import { MessageForCreate } from '../../models/dtos/message/message-for-create';
import { Message } from '../../models/entities/Chat/Message';
import { MessageDoc, messages } from '../../models/schemas/message.schema';
import { RepositoryBase } from './repository-base';

@injectable()
export class MessageRepository extends RepositoryBase<Message> implements IMessageRepository {
	constructor() {
		super(messages, Message);
	}
	async createMessage(messageForCreate: MessageForCreate): Promise<Message> {
		const createdMessage: MessageDoc = await this.model.create(messageForCreate);

		return new Message(createdMessage.toObject());
	}
}
