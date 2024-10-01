import "reflect-metadata"
import { NextFunction, Response } from 'express';
import Request from '../types/Request';
import { inject, injectable } from 'inversify';
import { PollService } from '../services/pollService';
import { PollInputDto } from '../models/dtos/post/poll/poll-input-dto';
import { isValid } from '../util/validationHandler';
import { VoteInputDto } from '../models/dtos/post/poll/vote-input-dto';

@injectable()
export class PollController {
	private _pollService: PollService;

	constructor(@inject(PollService) pollService: PollService) {
		this._pollService = pollService;
	}

	async createPoll(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const userId: string = req.userId;
			const files: Express.Multer.File[] = req.files;
			const poll: PollInputDto = req.body;

			const result = await this._pollService.createPoll(userId, poll, files);

			res.status(result.statusCode).json(result);
		} catch (err) {
			next(err);
		}
	}

	async votePoll(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const userId: string = req.userId;
			const pollId: string = req.body.pollId;
			const option: string = req.body.option;

			const voteInput: VoteInputDto = { pollId, userId, option };

			const result = await this._pollService.votePoll(voteInput);

			res.status(result.statusCode).json(result);
		} catch (err) {
			next(err);
		}
	}

	async deleteVote(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const userId: string = req.userId;
			const pollId: string = req.body.pollId;

			const result = await this._pollService.deleteVote(pollId, userId);

			res.status(result.statusCode).json(result);
		} catch (err) {
			next(err);
		}
	}
}
