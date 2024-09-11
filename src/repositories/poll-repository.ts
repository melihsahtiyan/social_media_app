import { IPollRepository } from '../types/repositories/IPollRepository';
import { Schema } from 'mongoose';
import { PostDoc, posts } from '../models/schemas/post.schema';
import { injectable } from 'inversify';
import { Poll } from '../models/entites/Poll';
import { Post } from '../models/entites/Post';
import { CustomError } from '../types/error/CustomError';

type ObjectId = Schema.Types.ObjectId;

@injectable()
export class PollRepository implements IPollRepository {
	constructor() {}

	async createPoll(poll: Poll): Promise<Post> {
		return await posts.create(poll);
	}
	async votePoll(pollId: ObjectId, userId: ObjectId, option: string): Promise<PostDoc> {
		const post = await posts.findById(pollId);
		if (!post) throw new CustomError('Poll not found', 404);

		const currentVersion = post.__v;

		const updatedPost = await posts.findOneAndUpdate(
			{ _id: pollId, __v: currentVersion },
			{
				$inc: { 'poll.totalVotes': 1, __v: 1 },
				$push: { 'poll.options.$[option].votes': userId },
			},
			{
				arrayFilters: [{ 'option.optionName': option }],
				new: true,
			}
		);

		if (!updatedPost) {
			throw new CustomError('Version conflict, please retry', 409);
		}

		return updatedPost;
	}

	//TODO: Check this method after testing
	async deleteVote(pollId: ObjectId, userId: ObjectId, option: string): Promise<PostDoc> {
		const post = await posts.findById(pollId);
		if (!post) throw new CustomError('Poll not found', 404);

		const currentVersion = post.__v;

		const updatedPost = await posts.findOneAndUpdate(
			{ _id: pollId, __v: currentVersion },
			{
				$inc: { 'poll.totalVotes': -1, __v: 1 },
				$pull: { 'poll.options.$[option].votes': userId },
			},
			{
				arrayFilters: [{ 'option.optionName': option }],
				new: true,
			}
		);

		if (!updatedPost) {
			throw new CustomError('Version conflict, please retry', 409);
		}

		return updatedPost;
	}
	async deletePoll(pollId: ObjectId): Promise<PostDoc> {
		return await posts.findByIdAndDelete(pollId);
	}
}
