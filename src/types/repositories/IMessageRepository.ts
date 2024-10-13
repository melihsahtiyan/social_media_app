import { MessageForCreate } from '../../models/dtos/message/message-for-create';
import { Message } from '../../models/entities/Chat/Message';
import { IRepositoryBase } from './IRepositoryBase';

export interface IMessageRepository extends IRepositoryBase<Message> {
	createMessage(messageForCreate: MessageForCreate): Promise<Message>;
}
