import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { ICommentService } from '../types/services/ICommentService';
import { CommentForCreateDto } from '../models/dtos/comment/comment-for-create';
import { CommentInputDto } from '../models/dtos/comment/comment-input-dto';
import { DataResult } from '../types/result/DataResult';
import { Result } from '../types/result/Result';
import { Comment } from '../models/entities/Comment';
import { User } from '../models/entities/User';
import { Post } from '../models/entities/Post';
import { ICommentRepository } from '../types/repositories/ICommentRepository';
import IUserRepository from '../types/repositories/IUserRepository';
import IPostRepository from '../types/repositories/IPostRepository';
import TYPES from '../util/ioc/types';

@injectable()
export class CommentService implements ICommentService {
	private commentRepository: ICommentRepository;
	private userRepository: IUserRepository;
	private postRepository: IPostRepository;
	constructor(
		@inject(TYPES.ICommentRepository) commentRepository: ICommentRepository,
		@inject(TYPES.IUserRepository) userRepository: IUserRepository,
		@inject(TYPES.IPostRepository) postRepository: IPostRepository
	) {
		this.commentRepository = commentRepository;
		this.userRepository = userRepository;
		this.postRepository = postRepository;
	}
	async create(commentInput: CommentInputDto, userId: string): Promise<Result> {
		try {
			const creator: User = await this.userRepository.getById(userId);

			if (!creator) return { success: false, message: 'User not found', statusCode: 404 };

			const comment: Comment = new Comment({
				content: commentInput.content,
				creator: creator._id,
				post: commentInput.postId,
				replies: [],
				likes: [],
				isUpdated: false,
			});

			await this.postRepository.getById(comment.getPostId());

			const isCreated: boolean = await this.commentRepository.create(comment);

			return {
				success: isCreated,
				message: isCreated ? 'Comment created successfully' : 'Comment creation failed',
				statusCode: isCreated ? 201 : 500,
			};
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async reply(commentId: string, replyInput: CommentInputDto, userId: string): Promise<Result> {
		try {
			const creator: User = await this.userRepository.getById(userId);
			if (!creator) return { success: false, message: 'User not found', statusCode: 404 };

			const repliedComment: Comment = await this.commentRepository.getById(commentId);
			if (!repliedComment) return { success: false, message: 'Comment not found', statusCode: 404 };

			const reply: Comment = new Comment({
				content: replyInput.content,
				creator: creator._id,
				post: repliedComment.post,
				replies: [],
				likes: [],
				isUpdated: false,
			});

			const post: Post = await this.postRepository.getById(reply.getPostId());

			if (!post) return { success: false, message: 'Post not found', statusCode: 404 };

			const repliedCommentPost: Post = await this.postRepository.getById(repliedComment.getPostId());

			if (!repliedCommentPost) return { success: false, message: 'Post not found', statusCode: 404 };

			if (repliedComment.checkReplyPostIdMatches(reply.getPostId()))
				return { success: false, message: 'Post not found', statusCode: 404 };

			const isReplyCreated: boolean = await this.commentRepository.reply(commentId, reply);

			return {
				success: isReplyCreated,
				message: isReplyCreated ? 'Comment replied successfully' : 'Comment reply failed',
				statusCode: isReplyCreated ? 201 : 500,
			};
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	// async getById(id: string): Promise<DataResult<CommentDoc>> {
	// 	throw new Error('Method not implemented.');
	// }
	async getCommentsByPostId(postId: string): Promise<DataResult<Array<Comment>>> {
		try {
			const post: Post = await this.postRepository.getById(postId);

			if (!post) {
				const result: DataResult<Array<Comment>> = {
					success: false,
					message: 'Post not found',
					data: null,
					statusCode: 404,
				};
				return result;
			}

			const postComments: Array<Comment> = await this.commentRepository.getCommentsByPostId(postId);

			const result: DataResult<Array<Comment>> = {
				success: true,
				message: 'Comments retrieved successfully',
				data: postComments,
				statusCode: 200,
			};

			return result;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
	async update(id: string, userId: string, content: string): Promise<Result> {
		try {
			const user: User = await this.userRepository.getById(userId);

			if (!user) {
				const result: Result = {
					success: false,
					message: 'User not found',
					statusCode: 404,
				};
				return result;
			}

			const comment: Comment = await this.commentRepository.getById(id);

			if (!comment) {
				const result: Result = {
					success: false,
					message: 'Comment not found',
					statusCode: 404,
				};
				return result;
			}

			if (!comment.isCreator(userId)) {
				const result: Result = {
					success: false,
					message: 'Unauthorized',
					statusCode: 401,
				};
				return result;
			}

			const isUpdated: boolean = await this.commentRepository.update(id, content);

			if (!isUpdated) {
				const result: Result = {
					success: false,
					message: 'Comment not found',
					statusCode: 404,
				};
				return result;
			}

			const result: Result = {
				success: true,
				message: 'Comment updated successfully',
				statusCode: 200,
			};

			return result;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
	async delete(id: string, userId: string): Promise<Result> {
		try {
			const comment: Comment = await this.commentRepository.getById(id);

			if (!comment) {
				const result: Result = {
					success: false,
					message: 'Comment not found',
					statusCode: 404,
				};
				return result;
			}

			if (!comment.isCreator(userId)) {
				const result: Result = {
					success: false,
					message: 'Unauthorized',
					statusCode: 401,
				};
				return result;
			}

			const isDeleted: boolean = await this.commentRepository.delete(id);

			if (!isDeleted) {
				const result: Result = {
					success: false,
					message: 'Comment not found',
					statusCode: 404,
				};
				return result;
			}

			const result: Result = {
				success: true,
				message: 'Comment deleted successfully',
				statusCode: 200,
			};

			return result;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
}
