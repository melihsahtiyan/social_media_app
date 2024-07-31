import mongoose from 'mongoose';

export type PollDetails = {
	_id: mongoose.Schema.Types.ObjectId;
	creator: mongoose.Schema.Types.ObjectId;
	options: { optionName: Array<string>; totalVotes: number }[];
	votes: [
		{
			voter: mongoose.Schema.Types.ObjectId;
			option: string;
		}
	];
	likeCount: number;
	likes: mongoose.Schema.Types.ObjectId[];
	comments: mongoose.Schema.Types.ObjectId[];
	commentCount: number;
	totalVotes: number;
	expiresAt: Date;
	createdAt: Date;
};
