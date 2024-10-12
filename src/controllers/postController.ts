import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import Request from '../types/Request';
import { NextFunction, Response } from 'express';
import { isValid } from '../util/validationHandler';
import { PostInputDto } from '../models/dtos/post/post-input-dto';
import { DataResult } from '../types/result/DataResult';
import { PostDoc } from '../models/schemas/post.schema';
import PostListDto from '../models/dtos/post/post-list';
import { PostDetails } from '../models/dtos/post/post-details';
import { Result } from '../types/result/Result';
import IPostService from '../types/services/IPostService';
import TYPES from '../util/ioc/types';

@injectable()
export class PostController {
	private _postService: IPostService;

	constructor(@inject(TYPES.IPostService) postService: IPostService) {
		this._postService = postService;
	}

	async getPostDetails(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const postId: string = req.params.postId;
			const userId: string = req.userId;

			const result: DataResult<PostDetails> = await this._postService.getPostDetails(postId, userId);

			// if (result.success) {
			//   for (let media in result.data.content.mediaUrls) {
			//     const extension = media.split(".").pop();
			//     const mimeType = videoMimetypes.find((type) => type === extension)
			//       ? "video"
			//       : "image";
			//     const filePath = path.join(__dirname, media); // assuming media is relative to this file
			//     res.download(filePath);
			//   }

			//   return res.status(result.statusCode).json({
			//     message: result.message,
			//     data: result.data,
			//   });
			// }

			return res.status(result.statusCode).json({ result });
		} catch (err) {
			next(err);
		}
	}

	async getPostById(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const postId: string = req.params.postId;
			const userId: string = req.userId;

			const result: DataResult<PostDetails> = await this._postService.getPostById(postId, userId);

			if (result.success) {
				return res.status(result.statusCode).json({
					message: result.message,
					data: result.data,
				});
			}

			return res.status(result.statusCode).json({ result });
		} catch (err) {
			next(err);
		}
	}

	async getPosts(req: Request, res: Response, next: NextFunction) {
		try {
			const result: DataResult<Array<PostDoc>> = await this._postService.getAllPosts();

			if (result.success)
				return res.status(result.statusCode).json({
					message: result.message,
					data: result.data,
				});

			return res.status(result.statusCode).json({ result });
		} catch (err) {
			console.log(err);
			next(err);
		}
	}

	async getFriendsPosts(req: Request, res: Response, next: NextFunction) {
		try {
			const result: DataResult<Array<PostListDto>> = await this._postService.getAllFriendsPosts(req.userId);

			if (result.success)
				return res.status(result.statusCode).json({
					message: result.message,
					data: result.data,
				});

			return res.status(result.statusCode).json({ result });
		} catch (err) {
			next(err);
		}
	}

	async getAllUniversityPosts(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const userId: string = req.userId;

			const result: DataResult<Array<PostListDto>> = await this._postService.getAllUniversityPosts(userId);

			if (result.success)
				return res.status(result.statusCode).json({
					message: result.message,
					data: result.data,
				});

			return res.status(result.statusCode).json({ result });
		} catch (err) {
			next(err);
		}
	}

	async likePost(req: Request, res: Response, next: NextFunction) {
		try {
			const postId: string = req.params.postId;
			const userId: string = req.userId;

			const result: DataResult<number> = await this._postService.likePost(postId, userId);

			return res.status(result.statusCode).json({
				message: result.message,
				data: result.data,
			});
		} catch (err) {
			next(err);
		}
	}

	async unlikePost(req: Request, res: Response, next: NextFunction) {
		try {
			const postId: string = req.params.postId;
			const userId: string = req.userId;

			const result: DataResult<number> = await this._postService.unlikePost(postId, userId);

			return res.status(result.statusCode).json({
				message: result.message,
				data: result.data,
			});
		} catch (err) {
			next(err);
		}
	}

	async createPost(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const files: Express.Multer.File[] = req.files;
			const userId: string = req.userId;
			const postInput: PostInputDto = req.body;

			const result: DataResult<PostInputDto> = await this._postService.createPost(postInput, userId, files);

			return res.status(result.success ? 201 : result.statusCode).json({
				message: result.message,
				data: result.data,
			});
		} catch (err) {
			next(err);
		}
	}

	async deletePost(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const postId: string = req.params.id;
			const userId: string = req.userId;

			const result: Result = await this._postService.deletePost(postId, userId);

			return res.status(result.statusCode).json({ message: result.message });
		} catch (err) {
			next(err);
		}
	}
}
