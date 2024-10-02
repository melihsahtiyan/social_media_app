import { MessageTypes } from "../../../models/entities/enums/messageEnums";
import { ObjectId } from "../../../types/ObjectId";

export type MessageForCreate = {
	chatId: ObjectId;
	partitionId: ObjectId;
	creator: ObjectId;
	content: string;
	type: MessageTypes;
	replyTo?: ObjectId;
	isForwarded: boolean;
	mention?: ObjectId[];
};
