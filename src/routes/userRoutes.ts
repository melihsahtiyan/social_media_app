import { Express, NextFunction, Response } from 'express';
import { query } from 'express-validator';
import { profilePhotoUpload } from '../util/fileUtil';
import isAuth from '../middleware/is-auth';
import { UserController } from '../controllers/userController';
import container from '../util/ioc/iocContainer';
import Request from '../types/Request';
import { logRequest } from '../util/loggingHandler';

const controller: UserController = container.get<UserController>(UserController);

function routes(app: Express) {
	app.get('/user/getAllUsers', logRequest, async (req: Request, res: Response, next: NextFunction) => {
		// #swagger.tags = ['User']
		await controller.getAllUsers(req, res, next);
	});

	app.get('/user/getAllDetails', logRequest, async (req: Request, res: Response, next: NextFunction) => {
		// #swagger.tags = ['User']
		await controller.getAllDetails(req, res, next);
	});

	app.get(
		'/user/viewUserProfile',
		[query('userId').isString().not().isEmpty()],
		isAuth,
		logRequest,
		async (req: Request, res: Response, next: NextFunction) => {
			// #swagger.tags = ['User']
			await controller.viewUserProfile(req, res, next);
		}
	);

	app.get(
		'/user/searchByName',
		[query('name').isString().not().isEmpty().withMessage('Name is required')],
		isAuth,
		logRequest,
		async (req: Request, res: Response, next: NextFunction) => {
			// #swagger.tags = ['User']
			await controller.searchByName(req, res, next);
		}
	);

	app.get('/user/getUserByToken', isAuth, logRequest, async (req: Request, res: Response, next: NextFunction) => {
		// #swagger.tags = ['User']
		await controller.getUserByToken(req, res, next);
	});

	app.put(
		'/user/updateProfile',
		profilePhotoUpload.single('profilePhoto'),
		isAuth,
		async (req: Request, res: Response, next: NextFunction) => {
			// #swagger.tags = ['User']
			// #swagger.deprecated = true
			await controller.updateProfile(req, res, next);
		}
	);

	app.put(
		'/user/changeProfilePhoto',
		profilePhotoUpload.single('profilePhoto'),
		isAuth,
		logRequest,
		async (req: Request, res: Response, next: NextFunction) => {
			// #swagger.tags = ['User']
			await controller.changeProfilePhoto(req, res, next);
		}
	);

	app.delete(
		'/user/deleteProfilePhoto',
		isAuth,
		logRequest,
		async (req: Request, res: Response, next: NextFunction) => {
			// #swagger.tags = ['User']
			await controller.deleteProfilePhoto(req, res, next);
		}
	);
}
export default routes;
