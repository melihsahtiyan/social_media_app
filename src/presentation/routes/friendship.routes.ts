import { Express, NextFunction, Response } from 'express';
import Request from '../../types/Request';
import { FriendshipController } from '../controllers/friendship.controller';
import isAuth from '../../middleware/is-auth';
import container from '../../util/ioc/iocContainer';
import { logRequest } from '../../util/loggingHandler';
import { body, query } from 'express-validator';
import TYPES from '../../util/ioc/types';

const controller: FriendshipController = container.get<FriendshipController>(TYPES.FriendshipController);

function routes(app: Express) {
	app.get('/user/getFriendRequests', isAuth, logRequest, async (req: Request, res: Response, next: NextFunction) => {
		// #swagger.tags = ['User']
		await controller.getAllFriendRequests(req, res, next);
	});

	app.put(
		'/user/sendFriendRequest',
		[body('userId').isAlphanumeric().not().isEmpty().withMessage('User ID cannot be empty!')],
		isAuth,
		logRequest,
		async (req: Request, res: Response, next: NextFunction) => {
			// #swagger.tags = ['User']
			/**
			 * #swagger.parameters['body'] = {
					in: 'body',
					description: 'User data.',
					required: true,
					schema: {
						userId: "660ab64a44696d035fec3a2b"
					}
				}
			 */
			await controller.sendFriendRequest(req, res, next);
		}
	);

	app.put(
		'/user/handleFriendRequest',
		[body('userId').isAlphanumeric().not().isEmpty(), body('response').isBoolean().not().isEmpty()],
		isAuth,
		logRequest,
		async (req: Request, res: Response, next: NextFunction) => {
			// #swagger.tags = ['User']
			/**
			 * #swagger.parameters['body'] = {
					in: 'body',
					description: 'User data.',
					required: true,
					schema: {
						userId: "660ab64a44696d035fec3a2b",
						response: true
					}
				}
			 */
			await controller.handleFollowRequest(req, res, next);
		}
	);

	app.put(
		'/user/unfriend',
		[query('userId').isString().not().isEmpty()],
		isAuth,
		logRequest,
		async (req: Request, res: Response, next: NextFunction) => {
			// #swagger.tags = ['User']
			/**
			 * #swagger.parameters['body'] = {
					in: 'body',
					description: 'User data.',
					required: true,
					schema: {
						userId: "660ab64a44696d035fec3a2b"
					}
				}
			 */
			await controller.unfriendUser(req, res, next);
		}
	);
}

export default routes;
