import express, { NextFunction, Response } from 'express';
import Request from '../../types/Request';
import { MessageController } from '../controllers/message.controller';
import container from '../../util/ioc/iocContainer';
import isAuth from '../../middleware/is-auth';
import { body, query } from 'express-validator';
import TYPES from '../../util/ioc/types';
import { singleMediaUpload } from '../../util/fileUtil';
import { logRequest } from '../../util/loggingHandler';

const controller: MessageController = container.get<MessageController>(TYPES.MessageController);

function routes(app: express.Express) {
	app.post(
		'/message/create',
		isAuth,
		[
			body('chatId').isString().withMessage('Chat ID must be a valid string'),
			body('content').optional().isString().withMessage('Content must be a valid string'),
			body('type').isString().withMessage('Type must be a valid string'),
			body('replyTo').optional().isString().withMessage('Reply To must be a valid string'),
			body('isForwarded').isBoolean().withMessage('Is Forwarded must be a valid boolean'),
			body('mention').optional().isArray().withMessage('Mention must be a valid array'),
		],
		singleMediaUpload.single('media'),
		logRequest,
		async (req: Request, res: Response, next: NextFunction) => {
			// #swagger.tags = ['Message']
			await controller.createMessage(req, res, next);
		}
	);

	app.get('/message/getAllByChatId', isAuth, logRequest, async (req: Request, res: Response, next: NextFunction) => {
		await controller.getAllMessagesByChatId(req, res, next);
	});

	app.get('/message/getAllByChunkId', isAuth, logRequest, async (req: Request, res: Response, next: NextFunction) => {
		await controller.getAllMessagesByChunkId(req, res, next);
	});

	app.put(
		'/message/update',
		isAuth,
		[
			body('messageId').isString().withMessage('Message ID must be a valid string'),
			body('content').isString().withMessage('Content must be a valid string'),
		],
		logRequest,
		async (req: Request, res: Response, next: NextFunction) => {
			await controller.updateMessage(req, res, next);
		}
	);

	app.delete(
		'/message/delete',
		isAuth,
		[query('id').isString().withMessage('Message ID must be a valid string')],
		logRequest,
		async (req: Request, res: Response, next: NextFunction) => {
			await controller.deleteMessage(req, res, next);
		}
	);
}

export default routes;
