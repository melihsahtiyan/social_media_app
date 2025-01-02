import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { CommentInputDto } from '../../models/dtos/comment/comment-input-dto';
import { DataResult } from '../../types/result/DataResult';
import { Result } from '../../types/result/Result';
import { Comment } from '../../models/entities/Comment';
import { User } from '../../models/entities/User';
import { Post } from '../../models/entities/Post';
import { ICommentRepository } from '../../persistence/abstracts/ICommentRepository';
import RepositoryIdentifiers from '../../persistence/constants/RepsitoryIdentifiers';
import { ICommentService } from '../abstracts/ICommentService';
import IUserService from '../abstracts/IUserService';
import IPostService from '../abstracts/IPostService';
import { ServiceIdentifiers } from '../constants/ServiceIdentifiers';

@injectable()
export class CommentService implements ICommentService {
	private commentRepository: ICommentRepository;
	private userService: IUserService;
	private postService: IPostService;
	constructor(
		@inject(RepositoryIdentifiers.ICommentRepository) commentRepository: ICommentRepository,
		@inject(ServiceIdentifiers.IUserService) userService: IUserService,
		@inject(ServiceIdentifiers.IPostService) postService: IPostService
	) {
		this.commentRepository = commentRepository;
		this.userService = userService;
		this.postService = postService;
	}
	async create(commentInput: CommentInputDto, userId: string): Promise<Result> {
		try {
			const creator: User = (await this.userService.getUserById(userId)).data;

			if (!creator) return { success: false, message: 'User not found', statusCode: 404 };

			const comment: Comment = new Comment({
				content: commentInput.content,
				creator: creator._id,
				post: commentInput.postId,
				replies: [],
				likes: [],
				isUpdated: false,
			});

			const post: Post = (await this.postService.getPostById(comment.getPostId(), userId)).data;

			if (!post) return { success: false, message: 'Post not found', statusCode: 404 };

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
			const creator: User = (await this.userService.getUserById(userId)).data;
			if (!creator) return { success: false, message: 'User not found', statusCode: 404 };

			const repliedComment: Comment = await this.commentRepository.get({ _id: commentId });
			if (!repliedComment) return { success: false, message: 'Comment not found', statusCode: 404 };

			const reply: Comment = new Comment({
				content: replyInput.content,
				creator: creator._id,
				post: repliedComment.post,
				replies: [],
				likes: [],
				isUpdated: false,
			});

			const post: Post = (await this.postService.getPostById(reply.getPostId(), userId)).data;

			if (!post) return { success: false, message: 'Post not found', statusCode: 404 };

			const repliedCommentPost: Post = (await this.postService.getPostById(repliedComment.getPostId(), userId)).data;

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

	// async getUserById(id: string): Promise<DataResult<CommentDoc>> {
	// 	throw new Error('Method not implemented.');
	// }
	async getCommentsByPostId(postId: string, userId: string): Promise<DataResult<Array<Comment>>> {
		try {
			const post: Post = (await this.postService.getPostById(postId, userId)).data;

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
			const user: User = (await this.userService.getUserById(userId)).data;

			if (!user) {
				const result: Result = {
					success: false,
					message: 'User not found',
					statusCode: 404,
				};
				return result;
			}

			const comment: Comment = await this.commentRepository.get({ _id: id });

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
			const comment: Comment = await this.commentRepository.get({ _id: id });

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
