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
import IPostService from "../types/services/IPostService";
import { PostDetails } from "../models/dtos/post/post-details";
import { PostForLike } from "../models/dtos/post/post-for-like";
import { Post } from "../models/entites/Post";
import { Result } from "../types/result/Result";
import { clearImage } from "../util/fileUtil";
import { handleUpload } from "../util/cloudinaryService";

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
  async getAllUniversityPosts(
    userId: string
  ): Promise<DataResult<Array<PostList>>> {
    try {
      const user: UserDoc = await this._userRepository.getById(userId);
      const posts: Array<Post> =
        await this._postRepository.getAllUniversityPosts(user.university);

      const postList: Array<PostList> = posts.map((post) => {
        const postForList: PostList = {
          _id: post._id,
          creator: post.creator,
          content: {
            caption: post.content.caption,
            mediaUrls: post.content.mediaUrls,
          },
          likes: post.likes,
          comments: post.comments,
          poll: post.poll,
          isUpdated: post.isUpdated,
          createdAt: post.createdAt,
          isLiked: post.likes.includes(user._id),
        };
        return postForList;
      });

      const result: DataResult<Array<PostList>> = {
        statusCode: 200,
        message: "University posts fetched!",
        success: true,
        data: postList,
      };

      return result;
    } catch (err) {
      err.message = err.message || "Fetching posts failed";
      throw err;
    }
  }
  async getPostById(
    postId: string,
    userId: string
  ): Promise<DataResult<PostDetails>> {
    try {
      const post: PostDetails = await this._postRepository.getPostById(postId);

      if (!post) {
        const error: CustomError = new Error("Post not found!");
        error.statusCode = 404;
        throw error;
      }

      const user: UserDoc = await this._userRepository.getById(userId);

      if (
        !user.friends.includes(post.creator._id) &&
        post.creator.university !== user.university
      ) {
        const error: CustomError = new Error(
          "You are not authorized to view this post!"
        );
        error.statusCode = 403;
        throw error;
      }

      if (post.likes.includes(user._id)) {
        post.isLiked = true;
      }

      const result: DataResult<PostDetails> = {
        statusCode: 200,
        message: "Post fetched!",
        success: true,
        data: post,
      };

      return result;
    } catch (err) {
      err.message = err.message || "Fetching post failed";
      throw err;
    }
  }
  async getPostDetails(
    postId: string,
    userId: string
  ): Promise<DataResult<PostDetails>> {
    try {
      const post: PostDetails = await this._postRepository.getPostDetailsById(
        postId
      );

      if (!post) {
        const result: DataResult<PostDetails> = {
          statusCode: 404,
          message: "Post not found!",
          success: false,
          data: null,
        };
        return result;
      }

      const user: UserDoc = await this._userRepository.getById(userId);

      if (
        !user.friends.includes(post.creator._id) &&
        post.creator.university !== user.university
      ) {
        const result: DataResult<PostDetails> = {
          statusCode: 403,
          message: "You are not authorized to view this post!",
          success: false,
          data: null,
        };
        return result;
      }

      const postDetails: PostDetails = {
        _id: post._id,
        creator: post.creator,
        content: {
          caption: post.content.caption,
          mediaUrls: post.content.mediaUrls,
        },
        poll: post.poll,
        likes: post.likes,
        comments: post.comments,
        createdAt: post.createdAt,
        commentCount: post.comments.length,
        likeCount: post.likes.length,
        isUpdated: post.isUpdated,
        isLiked: post.likes.includes(user._id),
      };

      const result: DataResult<PostDetails> = {
        statusCode: 200,
        message: "Post details fetched!",
        success: true,
        data: postDetails,
      };

      return result;
    } catch (err) {
      const error: CustomError = new Error(err);
      throw error;
    }
  }
  async getAllPosts(): Promise<DataResult<Array<PostDoc>>> {
    try {
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
            mediaUrls: post.content.mediaUrls,
          },
          likes: post.likes,
          comments: post.comments,
          poll: post.poll,
          isUpdated: post.isUpdated,
          createdAt: post.createdAt,
          isLiked: post.likes.includes(user._id),
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

  async likePost(
    postId: string,
    userId: string
  ): Promise<DataResult<PostForLike>> {
    try {
      const post: PostDetails = await this._postRepository.getPostById(postId);
      const user: UserDoc = await this._userRepository.getById(userId);

      if (post.likes.includes(user._id)) {
        const result: DataResult<PostForLike> = {
          statusCode: 400,
          message: "You already liked this post!",
          success: false,
          data: null,
        };
        return result;
      }

      const updatedPost: PostForLike = (await this._postRepository.likePost(
        post._id,
        user._id
      )) as PostForLike;

      const result: DataResult<PostForLike> = {
        statusCode: 200,
        message: "Post liked!",
        success: true,
        data: updatedPost,
      };

      return result;
    } catch (err) {
      err.message = err.message || "Liking post failed";
      throw err;
    }
  }
  async unlikePost(
    postId: string,
    userId: string
  ): Promise<DataResult<PostForLike>> {
    try {
      const post: PostDetails = await this._postRepository.getPostById(postId);
      const user: UserDoc = await this._userRepository.getById(userId);

      if (!post.likes.includes(user._id)) {
        const result: DataResult<PostForLike> = {
          statusCode: 400,
          message: "You have not liked this post!",
          success: false,
          data: null,
        };
        return result;
      }

      const updatedPost: PostForLike = (await this._postRepository.unlikePost(
        post._id,
        user._id
      )) as PostForLike;

      const result: DataResult<PostForLike> = {
        statusCode: 200,
        message: "Post unliked!",
        success: true,
        data: updatedPost,
      };

      return result;
    } catch (err) {
      const error: CustomError = new Error(err);
      throw err;
    }
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

      const user: UserDoc = await this._userRepository.getById(userId);

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
          sourceUrls = await Promise.all(
            files.map(async (file) => {
              const extension = file.mimetype.split("/")[1];
              const videoExtensions = [
                "mp4",
                "mov",
                "avi",
                "mkv",
                "webm",
                "m4v",
              ];
              const imageExtensions = [
                "jpg",
                "jpeg",
                "png",
                "webp",
                "heic",
                "gif",
              ];

              let folder: string;
              if (videoExtensions.includes(extension)) {
                folder = "media/videos/";
              } else if (imageExtensions.includes(extension)) {
                folder = "media/images/";
              } else {
                const error: CustomError = new Error("Invalid file type!");
                error.statusCode = 422;
                throw error;
              }

              const fileBuffer = file.buffer.toString("base64");
              let dataURI = "data:" + file.mimetype + ";base64," + fileBuffer;

              const fileResult: string = await handleUpload(dataURI, folder);
              return fileResult;
            })
          );
        }
      }

      const postForCreate: PostForCreate = {
        creator: user._id,
        content: {
          caption: postInput.caption,
          mediaUrls: sourceUrls,
        },
        poll: null,
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
      const error: CustomError = new Error(err);
      error.statusCode = err?.statusCode || 500;

      throw err;
    }
  }

  async deletePost(id: string, userId: string): Promise<Result> {
    try {
      const user: UserDoc = await this._userRepository.getById(userId);

      if (!user) {
        const result: Result = {
          statusCode: 404,
          message: "User not found!",
          success: false,
        };
        return result;
      }

      const post: PostDoc = await this._postRepository.getById(id);

      if (!post) {
        const result: Result = {
          statusCode: 404,
          message: "Post not found!",
          success: false,
        };
        return result;
      }

      if (post.creator.toString() !== user._id.toString()) {
        const result: Result = {
          statusCode: 403,
          message: "You are not authorized to delete this post!",
          success: false,
        };
        return result;
      }

      if (post.content.mediaUrls.length > 0) {
        post.content.mediaUrls.forEach((url) => {
          clearImage(url);
        });
      }

      const isDeleted: boolean = await this._postRepository.deletePost(id);

      if (!isDeleted) {
        const result: Result = {
          statusCode: 500,
          message: "Post deletion failed!",
          success: false,
        };
        return result;
      }

      const result: Result = {
        statusCode: 200,
        message: "Post deleted!",
        success: true,
      };
      return result;
    } catch (err) {
      throw err;
    }
  }
}
