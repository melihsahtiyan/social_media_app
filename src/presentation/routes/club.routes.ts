import { NextFunction, Response, Express } from 'express';
import Request from '../../types/Request';
import { ClubController } from '../controllers/club.controller';
import container from '../../util/ioc/iocContainer';
import { logRequest } from '../../util/loggingHandler';
import { profilePhotoUpload } from '../../util/fileUtil';
import isAuth from '../../middleware/is-auth';
import { body, param } from 'express-validator';
import TYPES from '../../util/ioc/types';

const controller: ClubController = container.get<ClubController>(TYPES.ClubController);

function routes(app: Express) {
	app.get('/club/getAllClubs', logRequest, isAuth, async (req: Request, res: Response, next: NextFunction) => {
		await controller.getClubs(req, res, next);
	});

	app.get(
		'/club/id=:id',
		logRequest,
		[param('id').isMongoId().withMessage('Invalid club id!')],
		isAuth,
		async (req: Request, res: Response, next: NextFunction) => {
			await controller.getClubById(req, res, next);
		}
	);

	app.post(
		'/club/create',
		logRequest,
		profilePhotoUpload.single('profilePhoto'),
		[body('name').not().isEmpty().isString().isLength({ min: 3 }), body('status').isBoolean()],
		isAuth,
		async (req: Request, res: Response, next: NextFunction) => {
			await controller.createClub(req, res, next);
		}
	);

	app.put(
		'/club/id=:id',
		logRequest,
		[
			param('id').isMongoId().withMessage('Invalid club id!'),
			body('name').isString().withMessage('Invalid name'),
			body('biography').isString().withMessage('Invalid biography'),
			body('status').isBoolean().withMessage('Invalid status')
		],
		isAuth,
		async (req: Request, res: Response, next: NextFunction) => {
			await controller.updateClub(req, res, next);
		}
	);

	app.put(
		'/club/id=:id/logo',
		logRequest,
		[param('id').isMongoId().withMessage('Invalid club id!')],
		profilePhotoUpload.single('profilePhoto'),
		isAuth,
		async (req: Request, res: Response, next: NextFunction) => {
			await controller.updateClubLogo(req, res, next);
		}
	);

	app.put(
		'/club/id=:id/banner',
		logRequest,
		[param('id').isMongoId().withMessage('Invalid club id!')],
		profilePhotoUpload.single('profilePhoto'),
		isAuth,
		async (req: Request, res: Response, next: NextFunction) => {
			await controller.updateClubBanner(req, res, next);
		}
	);

	app.put(
		'/club/id=:id/change-president',
		logRequest,
		[
			param('id').isMongoId().withMessage('Invalid club id!'),
			body('presidentId').isMongoId().withMessage('Invalid president id!')
		],
		isAuth,
		async (req: Request, res: Response, next: NextFunction) => {
			await controller.updateClubPresident(req, res, next);
		}
	);

	app.delete(
		'/club/id=:id',
		logRequest,
		[param('id').isMongoId().withMessage('Invalid club id!')],
		isAuth,
		async (req: Request, res: Response, next: NextFunction) => {
			await controller.deleteClub(req, res, next);
		}
	);
}

export default routes;
