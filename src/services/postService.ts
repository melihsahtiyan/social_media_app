import "reflect-metadata";
import { inject, injectable } from "inversify";
import { CustomError } from "../types/error/CustomError";
import { PostDoc } from "../models/schemas/post.schema";
import { PostInputDto } from "../models/dtos/post/post-input-dto";
import { PostRepository } from "../repositories/post-repository";
import { UserDoc } from "../models/schemas/user.schema";
import { UserRepository } from "../repositories/user-repository";
import PostList from "../models/dtos/post/post-list";
import { DataResult } from "../types/result/DataResult";
import { PostForCreate } from "../models/dtos/post/post-for-create";
import mongoose from "mongoose";
import IPostService from "../types/services/IPostService";

@injectable()
export class PostService implements IPostService {
  private _postRepository: PostRepository;
  private _userRepository: UserRepository;
  constructor(
    @inject(PostRepository) postRepository: PostRepository,
    @inject(UserRepository) userRepository: UserRepository
  ) {
    this._postRepository = postRepository;
    this._userRepository = userRepository;
  }

  async createPost(
    postInput: PostInputDto,
    userId: string,
    files?: Express.Multer.File[]
  ): Promise<DataResult<PostInputDto>> {
    try {
      if (!files && !postInput.caption) {
        const result: DataResult<PostInputDto> = {
          statusCode: 422,
          message: "Post must have content or media!",
          success: false,
          data: null,
        };
        return result;
      }

      let sourceUrls: string[] = [];

      if (files) {
        if (files.length > 10) {
          const result: DataResult<PostInputDto> = {
            statusCode: 422,
            message: "Too many files!",
            success: false,
            data: null,
          };
          return result;
        }

        if (files.length > 0) {
          sourceUrls = files.map((file) => {
            const extension = file.mimetype.split("/")[1];
            const videoExtensions = ["mp4", "mov", "avi", "mkv", "webm", "m4v"];
            const imageExtensions = ["jpg", "jpeg", "png"];

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
        }
      }

      const postForCreate: PostForCreate = {
        creator: new mongoose.Types.ObjectId(userId),
        content: {
          caption: postInput.caption,
          mediaUrls: sourceUrls,
        },
        type: "post",
      };

      const post: PostDoc = await this._postRepository.createPost(
        postForCreate
      );

      const result: DataResult<PostInputDto> = {
        statusCode: 201,
        message: "Post created!",
        success: true,
        data: postInput,
      };

      return result;
    } catch (err) {
      err.message = err.message || "Post creation failed";
      throw err;
    }
  }

  async getPosts(): Promise<DataResult<Array<PostDoc>>> {
    try {
      console.log("====================================");
      console.log("Post Service: getPosts");
      console.log("====================================");
      const posts: PostDoc[] = await this._postRepository.getAllPosts();

      const result: DataResult<Array<PostDoc>> = {
        statusCode: 200,
        message: "Posts fetched!",
        success: true,
        data: posts,
      };

      return new DataResult<Array<PostDoc>>(200, true, "Posts fetched!", posts);
    } catch (err) {
      err.message = err.message || "Fetching posts failed";
      throw err;
    }
  }

  async getAllFriendsPosts(
    userId: string
  ): Promise<DataResult<Array<PostList>>> {
    try {
      const user: UserDoc = await this._userRepository.getById(userId);

      const posts: PostDoc[] = await this._postRepository.getFriendsPosts(
        user._id
      );

      const postList: PostList[] = posts.map((post) => {
        const postForList: PostList = {
          _id: post._id,
          creator: post.creator,
          content: {
            caption: post.content.caption,
            files: post.content.mediaUrls,
          },
          type: post.type,
          likes: post.likes,
          comments: post.comments,
          isUpdated: post.isUpdated,
        };
        return postForList;
      });

      const result: DataResult<Array<PostList>> = {
        statusCode: 200,
        message: "Following posts fetched!",
        success: true,
        data: postList,
      };
      return result;
    } catch (err) {
      err.message = err.message || "Fetching posts failed";
      throw err;
    }
  }
}
