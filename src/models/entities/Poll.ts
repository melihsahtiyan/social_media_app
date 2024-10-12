import { ObjectId } from '../../types/ObjectId';
import { Entity } from './Entity';


export class Poll extends Entity {
	question: string;
	options: Array<{ optionName: string; votes: ObjectId[] }>;
	totalVotes: number;
	expiresAt: Date;
	constructor(
		question: string,
		options: Array<{ optionName: string; votes: ObjectId[] }>,
		totalVotes: number,
		expiresAt: Date
	) {
		super();
		this.question = question;
		this.options = options;
		this.totalVotes = totalVotes;
		this.expiresAt = expiresAt;
	}

	isAuthenticVoter(voter, creator): boolean {
		return voter.friends.includes(creator._id) || voter.university === creator.university ? true : false;
	}
	findVote(userId: ObjectId): {
		votes: ObjectId[];
		optionName: string;
	} {
		return this.options.find(opt => opt.votes.includes(userId));
	}

	isExpired(): boolean {
		return this.expiresAt < new Date(Date.now()) ? true : false;
	}

	isViableVote(optionName: string): boolean {
		return this.options.find(opt => opt.optionName === optionName) ? true : false;
	}

	// TODO: activate this method after refactoring the vote functionality
	// public voteOption(optionName: string): void {
	//   this.options.find((opt) => opt.optionName === optionName).votes++;
	//   this.totalVotes++;
	// }
}
