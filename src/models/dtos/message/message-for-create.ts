import { MessageStatus, MessageTypes } from "../../../models/entities/enums/messageEnums";
import { ObjectId } from "../../../types/ObjectId";
import { Dto } from "../Dto";

export interface MessageForCreate extends Dto {
	chatId: ObjectId;
	chunkId: ObjectId;
	creator: ObjectId;
	content: string;
	type: MessageTypes;
	replyTo?: ObjectId;
	isForwarded: boolean;
	mention?: ObjectId[];
	statuses: { status: MessageStatus; userId: ObjectId }[];
};
