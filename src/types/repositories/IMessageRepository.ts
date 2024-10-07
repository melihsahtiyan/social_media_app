import { MessageForCreate } from "../../models/dtos/message/message-for-create";
import { Message } from "../../models/entities/Chat/Message";

export interface IMessageRepository {
    create(messageForCreate: MessageForCreate): Promise<Message>;
    getById(messageId: string): Promise<Message>;
    getAll(filter: Partial<Message>): Promise<Array<Message>>;
    update(message: Message): Promise<Message>;
    delete(messageId: string): Promise<boolean>;
}