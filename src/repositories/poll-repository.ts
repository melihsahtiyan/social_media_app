import { IPollRepository } from '../types/repositories/IPollRepository';
import { Schema } from 'mongoose';
import { PostDoc, posts } from '../models/schemas/post.schema';
import { injectable } from 'inversify';
import { Poll } from '../models/entites/Poll';
import { Post } from '../models/entites/Post';

@injectable()
export class PollRepository implements IPollRepository {
	constructor() {}

	async createPoll(poll: Poll): Promise<Post> {
		return await posts.create(poll);
	}
	async votePoll(pollId: Schema.Types.ObjectId, userId: Schema.Types.ObjectId, option: string): Promise<PostDoc> {
		const post: PostDoc = await posts.findById(pollId);

		const poll = post.poll;
		const optionIndex: number = poll.options.findIndex(opt => opt.optionName === option);

		poll.options[optionIndex].votes.push(userId);
		poll.totalVotes += 1;

		post.poll = poll;

		return await post.save();
	}

	//TODO: Check this method after testing
	async deleteVote(pollId: Schema.Types.ObjectId, userId: Schema.Types.ObjectId, option: string): Promise<PostDoc> {
		const post: PostDoc = await posts.findById(pollId);

		const poll = post.poll;
		const optionIndex: number = poll.options.findIndex(opt => opt.optionName === option);
		const deletedVotePoll = poll.options[optionIndex].votes.filter(vote => vote !== userId);

		poll.options[optionIndex].votes = deletedVotePoll;
		poll.totalVotes -= 1;
		post.poll = poll;

		return await post.save();
	}
	async deletePoll(pollId: Schema.Types.ObjectId): Promise<PostDoc> {
		return await posts.findByIdAndDelete(pollId);
	}
}
