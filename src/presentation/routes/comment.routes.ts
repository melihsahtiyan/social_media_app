import { Express, Response, NextFunction } from 'express';
import Request from '../../types/Request';
import { CommentController } from '../controllers/comment.controller';
import container from '../../util/ioc/iocContainer';
import isAuth from '../../middleware/is-auth';
import { body, param } from 'express-validator';
import { logRequest } from '../../util/loggingHandler';
import TYPES from '../../util/ioc/types';

const controller: CommentController = container.get<CommentController>(TYPES.CommentController);

function routes(app: Express) {
	app.post(
		'/comment/create',
		isAuth,
		[body('postId').isAlphanumeric().not().isEmpty(), body('content').isString().not().isEmpty()],
		logRequest,
		async (req: Request, res: Response, next: NextFunction) => {
			await controller.create(req, res, next);
		}
	);

	app.post(
		'/comment/reply/:id',
		isAuth,
		[
			param('id').isAlphanumeric().not().isEmpty(),
			body('postId').isAlphanumeric().not().isEmpty(),
			body('content').isString().not().isEmpty()
		],
		logRequest,
		async (req: Request, res: Response, next: NextFunction) => {
			await controller.reply(req, res, next);
		}
	);

	app.get(
		'/comment/getCommentsByPostId/:postId',
		isAuth,
		[param('postId').isAlphanumeric().not().isEmpty()],
		logRequest,
		async (req: Request, res: Response, next: NextFunction) => {
			await controller.getCommentsByPostId(req, res, next);
		}
	);
}

export default routes;

//   getCommentsByPostId(
//     postId: string,
//     userId: string
//   ): Promise<DataResult<Array<CommentForListDto>>>;
//   getById(id: string): Promise<DataResult<CommentDoc>>;
//   delete(id: string, userId: string): Promise<Result>;
//   update(id: string, userId: string, content: string): Promise<Result>;
