import express, { NextFunction, Response } from 'express';
import container from '../util/ioc/iocContainer';
import { ChatController } from '../controllers/chatController';
import Request from '../types/Request';
import isAuth from '../middleware/is-auth';

const controller: ChatController = container.get<ChatController>(ChatController);

function routes(app: express.Express) {
	app.put('/chat/create', isAuth,async (req: Request, res: Response, next: NextFunction) => {
		// #swagger.tags = ['Chat']
		await controller.createChat(req, res, next);
	});
}

export default routes;
