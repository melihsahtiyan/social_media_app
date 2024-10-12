import { ObjectId } from '../../../../types/ObjectId';
import { Dto } from '../../Dto';

export interface PollCreateDto extends Dto {
	creator: ObjectId;
	caption: string;
	question: string;
	options: { optionName: string; votes: number }[];
	expiresAt: Date;
	content: { caption: string; mediaUrls: Array<string> };
};
