import { Dto } from '../../Dto';

export interface PollInputDto extends Dto {
	content: { caption: string; mediaUrls: Array<string> };
	question: string;
	options: Array<string>;
	expiresAt: Date;
}
