import "reflect-metadata";
import { inject, injectable } from "inversify";
import { PostService } from "../services/postService";
import TYPES from "../util/ioc/types";
import Request from "../types/Request";
import { NextFunction, Response } from "express";
import { isValid } from "../util/validationHandler";
import { PostInputDto } from "../models/dtos/post/post-input-dto";
import { DataResult } from "../types/result/DataResult";
import { PostDoc } from "../models/schemas/post.schema";
import PostList from "../models/dtos/post/post-list";

@injectable()
export class PostController {
  private _postService: PostService;

  constructor(@inject(PostService) postService: PostService) {
    this._postService = postService;
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

  async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("====================================");
      console.log("getPosts: ");
      console.log(typeof this._postService);
      console.log("====================================");

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
}
