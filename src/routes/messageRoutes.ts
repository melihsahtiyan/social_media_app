import express, { NextFunction, Response } from 'express';
import Request from '../types/Request';
import { MessageController } from '../controllers/messageController';
import container from '../util/ioc/iocContainer';
import isAuth from '../middleware/is-auth';
import { body } from 'express-validator';

const controller: MessageController = container.get<MessageController>(MessageController);

function routes(app: express.Express) {
	app.post(
		'/message/create',
		isAuth,
		[
			body('chatId').isString().withMessage('Chat ID must be a valid string'),
			body('content').isString().withMessage('Content must be a valid string'),
			body('type').isString().withMessage('Type must be a valid string'),
			body('replyTo').optional().isString().withMessage('Reply To must be a valid string'),
			body('isForwarded').isBoolean().withMessage('Is Forwarded must be a valid boolean'),
			body('mention').optional().isArray().withMessage('Mention must be a valid array'),
		],
		async (req: Request, res: Response, next: NextFunction) => {
			// #swagger.tags = ['Message']
			await controller.createMessage(req, res, next);
		}
	);
}

export default routes;
