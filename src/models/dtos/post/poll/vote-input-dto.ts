import { Dto } from '../../Dto';

export interface VoteInputDto extends Dto {
	pollId: string;
	userId: string;
	option: string;
};
