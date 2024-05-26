import { inject, injectable } from "inversify";
import { ICommentService } from "../types/services/ICommentService";
import { CommentForCreateDto } from "../models/dtos/comment/comment-for-create";
import { CommentForListDto } from "../models/dtos/comment/comment-for-list";
import { CommentInputDto } from "../models/dtos/comment/comment-input-dto";
import { DataResult } from "../types/result/DataResult";
import { Result } from "../types/result/Result";
import { UserRepository } from "../repositories/user-repository";
import { CommentRepository } from "../repositories/comment-repository";
import { PostRepository } from "../repositories/post-repository";
import { UserDoc } from "../models/schemas/user.schema";
import { PostDoc } from "../models/schemas/post.schema";
import { Comment } from "../models/entites/Comment";
import { CommentDoc } from "src/models/schemas/comment.schema";

@injectable()
export class CommentService implements ICommentService {
  private commentRepository: CommentRepository;
  private userRepository: UserRepository;
  private postRepository: PostRepository;
  constructor(
    @inject(CommentRepository) commentRepository: CommentRepository,
    @inject(UserRepository) userRepository: UserRepository,
    @inject(PostRepository) postRepository: PostRepository
  ) {
    this.commentRepository = commentRepository;
    this.userRepository = userRepository;
    this.postRepository = postRepository;
  }
  async create(
    comment: CommentInputDto,
    userId: string
  ): Promise<DataResult<CommentForCreateDto>> {
    try {
      const creator: UserDoc = await this.userRepository.getById(userId);

      if (!creator) {
        const result: DataResult<CommentForCreateDto> = {
          success: false,
          message: "User not found",
          data: null,
          statusCode: 404,
        };
        return result;
      }

      const post: PostDoc = await this.postRepository.getById(
        comment.postId.toString()
      );

      if (!post) {
        const result: DataResult<CommentForCreateDto> = {
          success: false,
          message: "Post not found",
          data: null,
          statusCode: 404,
        };
        return result;
      }

      const commentForCreate: CommentForCreateDto = {
        content: comment.content,
        creator: creator._id,
        post: post._id,
      };

      const createdComment: CommentForCreateDto =
        await this.commentRepository.create(commentForCreate);

      const result: DataResult<CommentForCreateDto> = {
        success: true,
        message: "Comment created successfully",
        data: createdComment,
        statusCode: 201,
      };

      return result;
    } catch (error) {
      throw error;
    }
  }

  async reply(
    commentId: string,
    reply: CommentInputDto,
    userId: string
  ): Promise<DataResult<CommentForCreateDto>> {
    try {
      const creator: UserDoc = await this.userRepository.getById(userId);

      if (!creator) {
        const result: DataResult<CommentForCreateDto> = {
          success: false,
          message: "User not found",
          data: null,
          statusCode: 404,
        };
        return result;
      }

      console.log("Comment Id: ", commentId);

      const comment: CommentDoc = await this.commentRepository.getById(
        commentId
      );

      console.log("Comment to reply: ", comment);

      if (!comment) {
        const result: DataResult<CommentForCreateDto> = {
          success: false,
          message: "Comment not found",
          data: null,
          statusCode: 404,
        };
        return result;
      }

      const post: PostDoc = await this.postRepository.getById(
        reply.postId.toString()
      );

      if (!post) {
        const result: DataResult<CommentForCreateDto> = {
          success: false,
          message: "Post not found",
          data: null,
          statusCode: 404,
        };
        return result;
      }

      const repliedCommentPost: PostDoc = await this.postRepository.getById(
        comment.post.toString()
      );

      if (!repliedCommentPost) {
        const result: DataResult<CommentForCreateDto> = {
          success: false,
          message: "Post not found",
          data: null,
          statusCode: 404,
        };
        return result;
      }

      if (reply.postId.toString() !== comment.post.toString()) {
        const result: DataResult<CommentForCreateDto> = {
          success: false,
          message: "Post not found",
          data: null,
          statusCode: 404,
        };
        return result;
      }

      const commentForCreate: CommentForCreateDto = {
        content: reply.content,
        creator: creator._id,
        post: post._id,
      };

      const createdComment: CommentForCreateDto =
        await this.commentRepository.reply(commentId, commentForCreate);

      const result: DataResult<CommentForCreateDto> = {
        success: true,
        message: "Comment created successfully",
        data: createdComment,
        statusCode: 201,
      };

      return result;
    } catch (error) {
      throw error;
    }
  }

  getById(id: string): Promise<DataResult<CommentDoc>> {
    throw new Error("Method not implemented.");
  }
  async getCommentsByPostId(
    postId: string,
    userId: string
  ): Promise<DataResult<CommentForListDto[]>> {
    try {
      const post: PostDoc = await this.postRepository.getById(postId);

      if (!post) {
        const result: DataResult<CommentForListDto[]> = {
          success: false,
          message: "Post not found",
          data: null,
          statusCode: 404,
        };
        return result;
      }

      const postComments: Array<Comment> =
        await this.commentRepository.getCommentsByPostId(postId);

      const commentsList: CommentForListDto[] = await Promise.all(
        postComments.map(async (comment) => {
          const creator = await this.userRepository.getById(
            comment.creator.toString()
          );

          const likes = await this.userRepository.getUsersByIdsForDetails(
            comment.likes,
            userId
          );
          const commentForList: CommentForListDto = {
            _id: comment._id,
            creator: {
              _id: creator._id,
              firstName: creator.firstName,
              lastName: creator.lastName,
              profilePicture: creator.profilePhotoUrl,
            },
            content: comment.content,
            isUpdated: comment.isUpdated,
            likes: likes,
            likeCount: comment.likes.length,
            createdAt: comment.createdAt,
            replies: [],
          };

          return commentForList;
        })
      );

      const result: DataResult<CommentForListDto[]> = {
        success: true,
        message: "Comments retrieved successfully",
        data: commentsList,
        statusCode: 200,
      };

      return result;
    } catch (error) {
      throw error;
    }
  }
  async delete(id: string, userId: string): Promise<Result> {
    try {
      const comment: CommentForCreateDto = await this.commentRepository.getById(
        id
      );
      const isDeleted: boolean = await this.commentRepository.delete(id);

      if (!isDeleted) {
        const result: Result = {
          success: false,
          message: "Comment not found",
          statusCode: 404,
        };
        return result;
      }

      const result: Result = {
        success: true,
        message: "Comment deleted successfully",
        statusCode: 200,
      };

      return result;
    } catch (error) {
      throw error;
    }
  }
  async update(id: string, userId: string, content: string): Promise<Result> {
    try {
      const user: UserDoc = await this.userRepository.getById(userId);

      if (!user) {
        const result: Result = {
          success: false,
          message: "User not found",
          statusCode: 404,
        };
        return result;
      }

      const comment: CommentForCreateDto = await this.commentRepository.getById(
        id
      );

      if (!comment) {
        const result: Result = {
          success: false,
          message: "Comment not found",
          statusCode: 404,
        };
        return result;
      }

      if (comment.creator.toString() !== userId) {
        const result: Result = {
          success: false,
          message: "Unauthorized",
          statusCode: 401,
        };
        return result;
      }

      const isUpdated: boolean = await this.commentRepository.update(
        id,
        content
      );

      if (!isUpdated) {
        const result: Result = {
          success: false,
          message: "Comment not found",
          statusCode: 404,
        };
        return result;
      }

      const result: Result = {
        success: true,
        message: "Comment updated successfully",
        statusCode: 200,
      };

      return result;
    } catch (error) {
      throw error;
    }
  }
}
