import { inject, injectable } from 'inversify';
import { CommentForCreateDto } from '../models/dtos/comment/comment-for-create';
import { CommentInputDto } from '../models/dtos/comment/comment-input-dto';
import { CommentService } from '../services/commentService';
import { DataResult } from '../types/result/DataResult';
import { Result } from '../types/result/Result';
import { NextFunction, Response } from 'express';
import Request from '../types/Request';
import { isValid } from '../util/validationHandler';
import { Comment } from '../models/entities/Comment';
import isAuth from '../middleware/is-auth';

@injectable()
export class CommentController {
	private commentService: CommentService;

	constructor(@inject(CommentService) commentService: CommentService) {
		this.commentService = commentService;
	}

	async create(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const comment: CommentInputDto = req.body;
			const userId: string = req.userId;
			const result: DataResult<CommentForCreateDto> = await this.commentService.create(comment, userId);

			return res.status(result.statusCode).json({ result });
		} catch (err) {
			next(err);
		}
	}
	async reply(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const commentId: string = req.params.id;
			const reply: CommentInputDto = req.body;
			const userId: string = req.userId;

			const result: DataResult<CommentForCreateDto> = await this.commentService.reply(commentId, reply, userId);

			return res.status(result.statusCode).json({ result });
		} catch (err) {
			next(err);
		}
	}
	async getCommentsByPostId(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			isAuth(req, res, next);
			const postId: string = req.params.postId;

			const result: DataResult<Array<Comment>> = await this.commentService.getCommentsByPostId(postId);

			return res.status(result.statusCode).json({ result });
		} catch (err) {
			next(err);
		}
	}
	// async getById(req: Request, res: Response, next: NextFunction) {
	// 	try {
	// 		isValid(req);
	// 		const id: string = req.params.id;

	// 		const result: DataResult<CommentDoc> = await this.commentService.getById(id);

	// 		return res.status(result.statusCode).json({ result });
	// 	} catch (err) {
	// 		next(err);
	// 	}
	// }
	async update(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const id: string = req.params.id;
			const userId: string = req.userId;
			const content: string = req.body.content;

			const result: Result = await this.commentService.update(id, userId, content);

			return res.status(result.statusCode).json({ result });
		} catch (err) {
			next(err);
		}
	}
	async delete(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const id: string = req.params.id;
			const userId: string = req.userId;

			const result: Result = await this.commentService.delete(id, userId);

			return res.status(result.statusCode).json({ result });
		} catch (err) {
			next(err);
		}
	}
}
