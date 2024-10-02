import express, { NextFunction, Response } from 'express';
import container from '../util/ioc/iocContainer';
import { ChatController } from '../controllers/chatController';
import Request from '../types/Request';
import isAuth from '../middleware/is-auth';
import { body, query } from 'express-validator';

const controller: ChatController = container.get<ChatController>(ChatController);

function routes(app: express.Express) {
	app.put('/chat/create', isAuth, async (req: Request, res: Response, next: NextFunction) => {
		// #swagger.tags = ['Chat']
		await controller.createChat(req, res, next);
	});

	app.get('/chat/getAll', async (req: Request, res: Response, next: NextFunction) => {
		// #swagger.tags = ['Chat']
		await controller.getAllChats(req, res, next);
	});

	app.get(
		'/chat/getById',
		isAuth,
		[query('id').isString().withMessage('Chat ID must be a valid string')],
		async (req: Request, res: Response, next: NextFunction) => {
			// #swagger.tags = ['Chat']
			await controller.getChatById(req, res, next);
		}
	);

	app.get(
		'/chat/getDetails',
		isAuth,
		[query('id').isString().withMessage('Chat ID must be a valid string')],
		async (req: Request, res: Response, next: NextFunction) => {
			// #swagger.tags = ['Chat']
			await controller.getChatDetails(req, res, next);
		}
	);

	app.put(
		'/chat/update',
		isAuth,
		[
			query('id').isString().withMessage('Chat ID must be a valid string'),
			body('admins').optional().isArray(),
			body('admins.*').isString(),
			body('title').optional().isString(),
			body('description').optional().isString(),
			body('isGroup').optional().isBoolean(),
		],
		async (req: Request, res: Response, next: NextFunction) => {
			// #swagger.tags = ['Chat']
			await controller.updateChat(req, res, next);
		}
	);
}

export default routes;
