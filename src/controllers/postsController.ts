import { PostService } from "../services/postService";
import Request from "../types/Request";
import { NextFunction, Response } from "express";
import { isValid } from "../util/validationHandler";
import { PostInputDto } from "../models/dtos/post/post-input-dto";
import { DataResult } from "../types/result/DataResult";
import { PostDoc } from "../models/mongoose/PostDoc";
import PostList from "../models/dtos/post/post-list";

export class PostsContoller {
  _postService: PostService;

  constructor(postService: PostService) {
    this._postService = postService;
  }

  async createPost(req: Request, res: Response, next: NextFunction) {
    isValid(req, next);
    const postInput: PostInputDto = req.body;
    const files = req.files;
    const userId = req.userId;

    const result: DataResult<PostInputDto> = await this._postService.createPost(
      postInput,
      userId,
      files
    );

    if (result.success)
      return res.status(201).json({
        message: "Post created successfully",
        data: result.data,
      });

    return res.status(result.statusCode).json({ result });
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
      throw err;
    }
  }

  async getFollowingPosts(req: Request, res: Response, next: NextFunction) {
    const result: DataResult<Array<PostList>> =
      await this._postService.getFollowingPosts(req.userId);

    if (result.success)
      return res.status(200).json({
        message: "Following posts fetched successfully",
        data: result.data,
      });

    return res.status(result.statusCode).json({ result });
  }
}
