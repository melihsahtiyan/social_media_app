import { ObjectId } from '../../../../types/ObjectId';

export type PollCreate = {
	creator: ObjectId;
	caption: string;
	question: string;
	options: { optionName: string; votes: number }[];
	expiresAt: Date;
	content: { caption: string; mediaUrls: Array<string> };
};
