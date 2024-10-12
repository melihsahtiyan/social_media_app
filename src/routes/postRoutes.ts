import { NextFunction, Response, Express } from 'express';
import Request from '../types/Request';
import { mediaArrayUpload } from '../util/fileUtil';
import isAuth from '../middleware/is-auth';
import { logRequest } from '../util/loggingHandler';
import { PostController } from '../controllers/postController';
import container from '../util/ioc/iocContainer';
import { param } from 'express-validator';
import TYPES from '../util/ioc/types';

const controller: PostController = container.get<PostController>(TYPES.PostController);

function routes(app: Express) {

	/**
	 * @swagger
	 * '/post/create':
	 *  post:
	 *   tags:
	 *     - Create Post
	 *   summary: Create a new post
	 *   requestBody:
	 *     required: true
	 *     contents:
	 * 		application/json:
	 * 			schema:
	 */
	app.post('/post/create', logRequest, mediaArrayUpload.array('medias'), isAuth, async (req: Request, res: Response, next: NextFunction) => {
		await controller.createPost(req, res, next);
	});

	app.get('/post/getAllPosts', logRequest, async (req: Request, res: Response, next: NextFunction) => {
		await controller.getPosts(req, res, next);
	});

	app.get('/post/getAllFriendsPosts', isAuth, logRequest, async (req: Request, res: Response, next: NextFunction) => {
		await controller.getFriendsPosts(req, res, next);
	});

	app.get(
		'/post/getAllUniversityPosts',
		isAuth,
		logRequest,
		async (req: Request, res: Response, next: NextFunction) => {
			await controller.getAllUniversityPosts(req, res, next);
		}
	);

	app.get(
		'/post/getPostDetails/postId=:postId',
		[param('postId').isMongoId().not().isEmpty().withMessage('Post id is required')],
		isAuth,
		logRequest,
		async (req: Request, res: Response, next: NextFunction) => {
			await controller.getPostDetails(req, res, next);
		}
	);

	app.get(
		'/post/getPostById/postId=:postId',
		[param('postId').isMongoId().not().isEmpty().withMessage('Post id is required')],
		isAuth,
		logRequest,
		async (req: Request, res: Response, next: NextFunction) => {
			await controller.getPostDetails(req, res, next);
		}
	);

	app.post(
		'/post/likePost/postId=:postId',
		isAuth,
		logRequest,
		async (req: Request, res: Response, next: NextFunction) => {
			await controller.likePost(req, res, next);
		}
	);

	app.post(
		'/post/unlikePost/postId=:postId',
		isAuth,
		logRequest,
		async (req: Request, res: Response, next: NextFunction) => {
			await controller.unlikePost(req, res, next);
		}
	);

	app.delete(
		'/post/delete/id=:id',
		[param('id').isMongoId().not().isEmpty().withMessage('Post id is required')],
		isAuth,
		logRequest,
		async (req: Request, res: Response, next: NextFunction) => {
			await controller.deletePost(req, res, next);
		}
	);
}

export default routes;
