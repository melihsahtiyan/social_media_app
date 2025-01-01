import express, { NextFunction, Response } 	from 'express';
import { body, query } 						from 'express-validator';
import Request 								from '../../types/Request';
import { profilePhotoUpload } 				from '../../util/fileUtil';
import isAuth 								from '../../middleware/is-auth';
import { ChatController } 					from '../controllers/chat.controller';
import ControllerIdentifiers 				from '../constants/ControllerIdentifiers';
import controllerContainer 					from '../PresentationServiceRegistration';

const controller: ChatController = controllerContainer.get<ChatController>(ControllerIdentifiers.ChatController);

function routes(app: express.Express) {
	app.post('/chat/create', isAuth, async (req: Request, res: Response, next: NextFunction) => {
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
		'/chat/getAllByUserId',
		isAuth,
		async (req: Request, res: Response, next: NextFunction) => {
			// #swagger.tags = ['Chat']
			await controller.getAllChatsByUserId(req, res, next);
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

	app.put(
		'/chat/addMember',
		isAuth,
		[
			query('id').isString().withMessage('Chat ID must be a valid string'),
			body('memberId').isString().withMessage('Member ID must be a valid string'),
		],
		async (req: Request, res: Response, next: NextFunction) => {
			// #swagger.tags = ['Chat']
			await controller.addChatMember(req, res, next);
		}
	);

	app.put(
		'/chat/removeMember',
		isAuth,
		[
			query('id').isString().withMessage('Chat ID must be a valid string'),
			body('memberId').isString().withMessage('Member ID must be a valid string'),
		],
		async (req: Request, res: Response, next: NextFunction) => {
			// #swagger.tags = ['Chat']
			await controller.removeChatMember(req, res, next);
		}
	);

	app.put(
		'/chat/setAvatar',
		isAuth,
		[query('id').isString().withMessage('Chat ID must be a valid string')],
		profilePhotoUpload.single('avatar'),
		async (req: Request, res: Response, next: NextFunction) => {
			// #swagger.tags = ['Chat']
			await controller.setChatAvatar(req, res, next);
		}
	);

	app.delete(
		'/chat/delete',
		isAuth,
		[query('id').isString().withMessage('Chat ID must be a valid string')],
		async (req: Request, res: Response, next: NextFunction) => {
			// #swagger.tags = ['Chat']
			await controller.deleteChat(req, res, next);
		}
	);
}

export default routes;
