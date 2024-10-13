import 'reflect-metadata';
import { IPollRepository } from '../types/repositories/IPollRepository';
import { injectable } from 'inversify';
import { Poll } from '../models/entities/Poll';
import { CustomError } from '../types/error/CustomError';
import { ObjectId } from '../types/ObjectId';
import { RepositoryBase } from './repository-base';
import { polls } from '../models/schemas/poll.schema';


@injectable()
export class PollRepository extends RepositoryBase<Poll> implements IPollRepository {
	constructor() {
		super(polls, Poll);
	}

	override async create(poll: Poll): Promise<boolean> {
		try {
			const createdPoll = await this.model.create(poll);
			return !!createdPoll;
		} catch (error) {
			const customError: CustomError = new Error(error.message);
			customError.statusCode = 500;
			customError.className = 'PollRepository';
			customError.functionName = 'create';
			throw customError;
		}
	}
	async vote(pollId: ObjectId, userId: ObjectId, option: string): Promise<boolean> {
		const post = await this.model.findById(pollId);
		if (!post) throw new CustomError('Poll not found', 404);

		const currentVersion = post.__v;

		const updatedPost = await this.model.findOneAndUpdate(
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

		return !!updatedPost;
	}

	//TODO: Check this method after testing
	async deleteVote(pollId: ObjectId, userId: ObjectId, option: string): Promise<boolean> {
		const post = await this.model.findById(pollId);
		if (!post) throw new CustomError('Poll not found', 404);

		const currentVersion = post.__v;

		const updatedPost = await this.model.findOneAndUpdate(
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

		return !!updatedPost;
	}
}
