import { NextFunction, Response, Express } from 'express';
import Request from '../types/Request';
import { mediaUpload } from '../util/fileUtil';
import isAuth from '../middleware/is-auth';
import { logRequest } from '../util/loggingHandler';
import container from '../util/ioc/iocContainer';
import { body } from 'express-validator';
import { PollController } from '../controllers/pollController';

const controller: PollController = container.get<PollController>(PollController);

function routes(app: Express) {
	app.post(
		'/poll/create',
		[
			body('question').not().isEmpty().withMessage('Question is required'),
			body('options')
				.isArray({ min: 2, max: 7 })
				.withMessage('Options are required and must be between 2 and 7 items long'),
			body('expiresAt').not().isEmpty().withMessage('Expiry date is required')
		],
		logRequest,
		mediaUpload,
		isAuth,
		async (req: Request, res: Response, next: NextFunction) => {
			await controller.createPoll(req, res, next);
		}
	);

	app.post(
		'/poll/vote',
		[
			body('pollId').not().isEmpty().withMessage('Poll ID is required'),
			body('option').not().isEmpty().withMessage('Option is required')
		],
		logRequest,
		isAuth,
		async (req: Request, res: Response, next: NextFunction) => {
			await controller.votePoll(req, res, next);
		}
	);

	app.delete(
		'/poll/deleteVote',
		[body('pollId').not().isEmpty().withMessage('Poll ID is required')],
		logRequest,
		isAuth,
		async (req: Request, res: Response, next: NextFunction) => {
			await controller.deleteVote(req, res, next);
		}
	);
}

export default routes;
