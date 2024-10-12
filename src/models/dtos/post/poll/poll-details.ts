import { ObjectId } from '../../../../types/ObjectId';
import { Dto } from '../../Dto';

export interface PollDetailsDto extends Dto {
	_id: ObjectId;
	creator: ObjectId;
	options: { optionName: Array<string>; totalVotes: number }[];
	votes: [
		{
			voter: ObjectId;
			option: string;
		}
	];
	likeCount: number;
	likes: ObjectId[];
	comments: ObjectId[];
	commentCount: number;
	totalVotes: number;
	expiresAt: Date;
	createdAt: Date;
};
