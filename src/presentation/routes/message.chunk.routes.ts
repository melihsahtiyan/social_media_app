import { MessageChunkController } from '../controllers/message.chunk.controller';
import express, { NextFunction, Response } from 'express';
import Request from '../../types/Request';
import { logRequest } from '../../util/loggingHandler';
import isAuth from '../../middleware/is-auth';
import { query } from 'express-validator';
import ControllerIdentifiers from '../constants/ControllerIdentifiers';
import controllerContainer from '../PresentationServiceRegistration';

const controller: MessageChunkController = controllerContainer.get<MessageChunkController>(ControllerIdentifiers.MessageChunkController);

function messageChunkRoutes(app: express.Express) {
	app.get(
		'/messageChunk/getChunk',
		[query('chunkId').isString().notEmpty()],
		logRequest,
		isAuth,
		async (req: Request, res: Response, next: NextFunction) => {
			// #swagger.tags = ['MessageChunk']
			await controller.getChunk(req, res, next);
		}
	);
	app.get(
		'/messageChunk/getChunksByChatId',
		[query('chatId').isString().notEmpty()],
		logRequest,
		isAuth,
		async (req: Request, res: Response, next: NextFunction) => {
			await controller.getChunksByChatId(req, res, next);
		}
	);

	app.get('/messageChunk/getAllChunks', logRequest, async (req: Request, res: Response, next: NextFunction) => {
		await controller.getAllChunks(req, res, next);
	});
}

export default messageChunkRoutes;
