import { CustomError } from "../types/error/CustomError";
import { PostDoc } from "../models/mongoose/PostDoc";
import { PostInputDto } from "../models/dtos/post/post-input-dto";
import { PostRepository } from "../repositories/post-repository";
import { UserDoc } from "../models/mongoose/UserDoc";
import { UserRepository } from "../repositories/user-repository";
import PostList from "../models/dtos/post/post-list";
import path from "path";
import fs from "fs";
import { DataResult } from "../types/result/DataResult";
import { PostForCreate } from "src/models/dtos/post/post-for-create";
import mongoose from "mongoose";

export class PostService {
  _postRepository: PostRepository;
  _userRepository: UserRepository;
  constructor(postRepository: PostRepository, userRepository: UserRepository) {
    this._postRepository = postRepository;
    this._userRepository = userRepository;
  }
  createPost = async (
    postInput: PostInputDto,
    userId: string,
    files: any
  ): Promise<DataResult<PostInputDto>> => {
    try {
      if (files.length === 0 && postInput.caption.length === 0) {
        const result: DataResult<PostInputDto> = {
          statusCode: 422,
          message: "Post must have content or media!",
          success: false,
          data: null,
        };
        return result;
      }

      if (files.values.length > 10) {
        const result: DataResult<PostInputDto> = {
          statusCode: 422,
          message: "Too many files!",
          success: false,
          data: null,
        };
        return result;
      }

      const sourceUrls: string[] = files.map((file) => {
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

      const postForCreate: PostForCreate = {
        creator: new mongoose.Schema.Types.ObjectId(userId),
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
  };

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

  getFollowingPosts = async (
    userId: string
  ): Promise<DataResult<Array<PostList>>> => {
    try {
      const user: UserDoc = await this._userRepository.getById(userId);

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

        console.log("====================================");
        console.log("Files: ", files);
        console.log("====================================");

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
  };
}
