import { inject, injectable } from 'inversify';
import { ICommentService } from '../types/services/ICommentService';
import { CommentForCreateDto } from '../models/dtos/comment/comment-for-create';
import { CommentInputDto } from '../models/dtos/comment/comment-input-dto';
import { DataResult } from '../types/result/DataResult';
import { Result } from '../types/result/Result';
import { UserRepository } from '../repositories/user-repository';
import { CommentRepository } from '../repositories/comment-repository';
import { PostRepository } from '../repositories/post-repository';
import { Comment } from '../models/entities/Comment';
import { User } from '../models/entities/User';
import { Post } from '../models/entities/Post';

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
	async create(commentInput: CommentInputDto, userId: string): Promise<DataResult<Comment>> {
		try {
			const creator: User = await this.userRepository.getById(userId);

			if (!creator) {
				const result: DataResult<Comment> = {
					success: false,
					message: 'User not found',
					data: null,
					statusCode: 404,
				};
				return result;
			}

			const comment: Comment = new Comment({
				content: commentInput.content,
				creator: creator._id,
				post: commentInput.postId,
				replies: [],
				likes: [],
				isUpdated: false,
			});

			await this.postRepository.getById(comment.getPostId());

			const createdComment: Comment = await this.commentRepository.create(comment);

			const result: DataResult<Comment> = {
				success: true,
				message: 'Comment created successfully',
				data: createdComment,
				statusCode: 201,
			};

			return result;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async reply(
		commentId: string,
		replyInput: CommentInputDto,
		userId: string
	): Promise<DataResult<CommentForCreateDto>> {
		try {
			const creator: User = await this.userRepository.getById(userId);

			if (!creator) {
				const result: DataResult<CommentForCreateDto> = {
					success: false,
					message: 'User not found',
					data: null,
					statusCode: 404,
				};
				return result;
			}

			const repliedComment: Comment = await this.commentRepository.getById(commentId);

			if (!repliedComment) {
				const result: DataResult<CommentForCreateDto> = {
					success: false,
					message: 'Comment not found',
					data: null,
					statusCode: 404,
				};
				return result;
			}

			const reply: Comment = new Comment({
				content: replyInput.content,
				creator: creator._id,
				post: repliedComment.post,
				replies: [],
				likes: [],
				isUpdated: false,
			});

			const post: Post = await this.postRepository.getById(reply.getPostId());

			if (!post) {
				const result: DataResult<CommentForCreateDto> = {
					success: false,
					message: 'Post not found',
					data: null,
					statusCode: 404,
				};
				return result;
			}

			const repliedCommentPost: Post = await this.postRepository.getById(repliedComment.getPostId());

			if (!repliedCommentPost) {
				const result: DataResult<CommentForCreateDto> = {
					success: false,
					message: 'Post not found',
					data: null,
					statusCode: 404,
				};
				return result;
			}

			if (repliedComment.checkReplyPostIdMatches(reply.getPostId())) {
				const result: DataResult<CommentForCreateDto> = {
					success: false,
					message: 'Post not found',
					data: null,
					statusCode: 404,
				};
				return result;
			}

			const createdComment: CommentForCreateDto = await this.commentRepository.reply(commentId, reply);

			const result: DataResult<CommentForCreateDto> = {
				success: true,
				message: 'Comment created successfully',
				data: createdComment,
				statusCode: 201,
			};

			return result;
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
