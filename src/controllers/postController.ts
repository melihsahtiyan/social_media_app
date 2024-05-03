import "reflect-metadata";
import { inject, injectable } from "inversify";
import { PostService } from "../services/postService";
import Request from "../types/Request";
import { NextFunction, Response } from "express";
import { isValid } from "../util/validationHandler";
import { PostInputDto } from "../models/dtos/post/post-input-dto";
import { DataResult } from "../types/result/DataResult";
import { PostDoc } from "../models/schemas/post.schema";
import PostList from "../models/dtos/post/post-list";
import { PostDetails } from "../models/dtos/post/post-details";
import { CustomError } from "../types/error/CustomError";
import { PostForLike } from "../models/dtos/post/post-for-like";

@injectable()
export class PostController {
  private _postService: PostService;

  constructor(@inject(PostService) postService: PostService) {
    this._postService = postService;
  }

  async getPostDetails(req: Request, res: Response, next: NextFunction) {
    isValid(req, next);
    try {
      const postId: string = req.params.postId;
      const userId: string = req.userId;

      const result: DataResult<PostDetails> =
        await this._postService.getPostDetails(postId, userId);

      if (result.success) {
        return res.status(200).json({
          message: "Post fetched successfully",
          data: result.data,
        });
      }

      return res.status(result.statusCode).json({ result });
    } catch (err) {
      const error: CustomError = new Error(err.message);
      error.statusCode = 500;
      next(error);
    }
  }

  async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const result: DataResult<Array<PostDoc>> =
        await this._postService.getPosts();

      if (result.success)
        return res.status(200).json({
          message: "Posts fetched successfully",
          data: result.data,
        });

      return res.status(result.statusCode).json({ result });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async getFriendsPosts(req: Request, res: Response, next: NextFunction) {
    const result: DataResult<Array<PostList>> =
      await this._postService.getAllFriendsPosts(req.userId);

    if (result.success)
      return res.status(200).json({
        message: "Following posts fetched successfully",
        data: result.data,
      });

    return res.status(result.statusCode).json({ result });
  }

  async likePost(req: Request, res: Response, next: NextFunction) {
    try {
      const postId: string = req.params.postId;
      const userId: string = req.userId;

      const result: DataResult<PostForLike> = await this._postService.likePost(
        postId,
        userId
      );

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

      const result: DataResult<PostForLike> =
        await this._postService.unlikePost(postId, userId);

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
      const files: Express.Multer.File[] = req.files;
      const userId: string = req.userId;
      const postInput: PostInputDto = req.body;

      const result: DataResult<PostInputDto> =
        await this._postService.createPost(postInput, userId, files);

      return res.status(result.success ? 201 : result.statusCode).json({
        message: result.message,
        data: result.data,
      });
    } catch (err) {
      next(err);
    }
  }
}
