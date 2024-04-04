import { NextFunction, Response } from "express";
import Request from "../types/Request";
import { isValid } from "../util/validationHandler";
import { CustomError } from "../types/error/CustomError";
import { PostDoc } from "../models/Post";
import { PostInputDto } from "../types/dtos/post/post-input-dto";
import { PostRepository } from "../repositories/post-repository";
import { UserDoc } from "../models/User";
import { UserRepository } from "../repositories/user-repository";
import PostList from "../types/dtos/post/post-list";
import path from "path";
import fs from "fs";

export class PostService {
  _postRepository: PostRepository;
  _userRepository: UserRepository;
  constructor(postRepository: PostRepository, userRepository: UserRepository) {
    this._postRepository = postRepository;
    this._userRepository = userRepository;
  }
  createPost = async (req: Request, res: Response, next: NextFunction) => {
    isValid(req, next);
    const postInput: PostInputDto = req.body;

    console.log("====================================");
    console.log(req.body);
    console.log("====================================");

    try {
      if (req.files.length === 0 && postInput.caption.length === 0) {
        const error: CustomError = new Error(
          "Post must have content or media!"
        );
        error.statusCode = 422; // Unprocessable Entity
        throw error;
      }

      if (req.files.values.length > 10) {
        const error: CustomError = new Error("Too many files!");
        error.statusCode = 422; // Unprocessable Entity
        throw error;
      }

      const sourceUrls: string[] = req.files.map((file) => {
        const extension = file.mimetype.split("/")[1];
        const videoExtensions = ["mp4", "mov", "avi", "mkv", "webm", "m4v"];
        const imageExtensions = ["jpg", "jpeg", "png", "gif"];

        if (videoExtensions.includes(extension)) {
          return "media/videos/" + file.filename;
        } else if (imageExtensions.includes(extension)) {
          return "media/images/" + file.filename;
        } else {
          const error: CustomError = new Error("Invalid file type!");
          error.statusCode = 422; // Unprocessable Entity

          throw error;
        }
      });

      postInput.mediaUrls = sourceUrls;

      const post: PostDoc = await this._postRepository.createPost(postInput);

      res.status(201).json({ message: "Post created!", post: post });
    } catch (err) {
      err.message = err.message || "Post creation failed";
      next(err);
    }
  };

  getPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts: PostDoc[] = await this._postRepository.getAllPosts();
      return res.status(200).json({ posts: posts });
    } catch (err) {
      err.message = err.message || "Fetching posts failed";
      next(err);
    }
  };

  getFollowingPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user: UserDoc = await this._userRepository.getById(req.userId);

      const posts: PostDoc[] = await this._postRepository.getFollowingPosts(
        user._id
      );

      const postList: PostList[] = posts.map((post) => {
        const files: File[] = [];

        post.content.mediaUrls.map((url: string) => {
          fs.readFile(path.join(__dirname, "../", url), (err, data) => {
            if (err) {
              throw err;
            }
            const result: File = new File([data], url);
            return files.push(result);
          });
        });

        console.log('====================================');
        console.log("Files: ", files);
        console.log('====================================');

        const postForList: PostList = {
          _id: post._id,
          creator: post.creator._id,
          content: {
            caption: post.content.caption,
            files: files,
          },
          type: post.type,
          likes: post.likes,
          comments: post.comments,
          createdAt: post.createdAt,
          isUpdated: post.isUpdated,
        };

        return postForList;
      });

      res.status(200).json({ posts: postList });
    } catch (err) {
      err.message = err.message || "Fetching posts failed";
      next(err);
    }
  };
}
