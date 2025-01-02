import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { CustomError } from '../../types/error/CustomError';
import { PostDoc } from '../../models/schemas/post.schema';
import { PostInputDto } from '../../models/dtos/post/post-input-dto';
import PostListDto from '../../models/dtos/post/post-list';
import { DataResult } from '../../types/result/DataResult';
import { PostForCreate } from '../../models/dtos/post/post-for-create';
import { PostDetails } from '../../models/dtos/post/post-details';
import { Post } from '../../models/entities/Post';
import { Result } from '../../types/result/Result';
import { User } from '../../models/entities/User';
import IPostRepository from '../../persistence/abstracts/IPostRepository';
import { ObjectId } from '../../types/ObjectId';
import { ServiceIdentifiers } from '../constants/ServiceIdentifiers';
import RepositoryIdentifiers from '../../persistence/constants/RepsitoryIdentifiers';
import IPostService from '../abstracts/IPostService';
import { IFileUploadService } from '../abstracts/IFileUploadService';
import IUserService from '../abstracts/IUserService';

@injectable()
export class PostService implements IPostService {
	private postRepository: IPostRepository;
	private userService: IUserService;
	private cloudinaryService: IFileUploadService;
	constructor(
		@inject(RepositoryIdentifiers.IPostRepository) postRepository: IPostRepository,
		@inject(ServiceIdentifiers.IUserService) userService: IUserService,
		@inject(ServiceIdentifiers.IFileUploadService) cloudinaryService: IFileUploadService
	) {
		this.postRepository = postRepository;
		this.userService = userService;
		this.cloudinaryService = cloudinaryService;
	}

	async createPost(postInput: PostInputDto, userId: string, files?: Express.Multer.File[]): Promise<Result> {
		try {
			if ((!files || files.length === 0) && (!postInput.caption || postInput.caption === '')) {
				return {
					statusCode: 422,
					message: 'Please provide media or caption!',
					success: false,
				};
			}

			const user: User = (await this.userService.getUserById(userId)).data;

			let sourceUrls: string[] = [];

			if (files) {
				// Check if the number of files is greater than 10
				if (files.length > 10)
					return { statusCode: 422, message: 'You can upload up to 10 media files!', success: false };

				// If the files valid, upload them to cloudinary
				if (files.length > 0) {
					sourceUrls = await Promise.all(
						files.map(async file => {
							const publicId: string = await this.cloudinaryService.handleUpload(file, 'media');
							return publicId;
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
				poll: postInput.poll || null,
			};

			const isPostCreated: boolean = await this.postRepository.create(postForCreate);

			return {
				statusCode: isPostCreated ? 201 : 500,
				message: isPostCreated ? 'Post created!' : 'Post creation failed!',
				success: isPostCreated,
			};
		} catch (err) {
			const error: CustomError = new Error(err);
			error.statusCode = err?.statusCode || 500;

			throw err;
		}
	}

	async getTotalLikes(postIds: Array<ObjectId>): Promise<DataResult<number>> {
		try {
			const posts: Array<Post> = await this.postRepository.getAll({ _id: postIds });

			const totalLikes: number = posts.reduce((total, post) => total + post.likes.length, 0);

			return {
				statusCode: 200,
				message: 'Total likes fetched!',
				success: true,
				data: totalLikes,
			};
		} catch (err) {
			const error: CustomError = new CustomError(
				err.message,
				err.statusCode || 500,
				err.errors || null,
				'PostService',
				'getTotalLikes'
			);
			throw error;
		}
	}

	async getAllPosts(): Promise<DataResult<Array<PostDoc>>> {
		try {
			const posts: PostDoc[] = await this.postRepository.getAllPopulatedPosts();

			const result: DataResult<Array<PostDoc>> = {
				statusCode: 200,
				message: 'Posts fetched!',
				success: true,
				data: posts,
			};

			return result;
		} catch (err) {
			const error: CustomError = new Error(err);
			throw error;
		}
	}

	async getAllFriendsPosts(userId: string): Promise<DataResult<Array<PostListDto>>> {
		try {
			const user: User = (await this.userService.getUserById(userId)).data;

			// const posts: Post[] = await this.postRepository.getFriendsPosts(user.getId());
			const posts: Post[] = await this.postRepository.getAll({ creator: { $in: user.friends } });

			const postList: PostListDto[] = posts.map((post: Post) => {
				return {
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
					isLiked: post.isLiked(user._id),
				} as PostListDto;
			});

			const result: DataResult<Array<PostListDto>> = {
				statusCode: 200,
				message: 'Following posts fetched!',
				success: true,
				data: postList,
			};
			return result;
		} catch (err) {
			const error: CustomError = new Error(err);
			throw error;
		}
	}
	async getAllUniversityPosts(userId: string): Promise<DataResult<Array<PostListDto>>> {
		try {
			const user: User = (await this.userService.getUserById(userId)).data;

			if (!user) {
				const result: DataResult<Array<PostListDto>> = {
					statusCode: 404,
					message: 'User not found!',
					success: false,
					data: null,
				};
				return result;
			}

			const posts: Array<Post> = await this.postRepository.getAllUniversityPosts(user.university);

			const postList: Array<PostListDto> = posts.map(post => {
				return {
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
					isLiked: post.isLiked(user._id),
				} as PostListDto;
			});

			const result: DataResult<Array<PostListDto>> = {
				statusCode: 200,
				message: 'University posts fetched!',
				success: true,
				data: postList,
			};

			return result;
		} catch (err) {
			const error: CustomError = new CustomError(err, 500, null, 'PostService', 'getAllUniversityPosts');
			throw error;
		}
	}
	async getPostDetails(postId: string, userId: string): Promise<DataResult<PostDetails>> {
		try {
			const post: Post = await this.postRepository.get({ _id: postId });

			if (!post) {
				const result: DataResult<PostDetails> = {
					statusCode: 404,
					message: 'Post not found!',
					success: false,
					data: null,
				};
				return result;
			}

			const creator: User = (await this.userService.getUserById(userId)).data;

			const user: User = (await this.userService.getUserById(userId)).data;

			if (!user.isFriendOrSameUniversity(creator)) {
				const result: DataResult<PostDetails> = {
					statusCode: 403,
					message: 'You are not authorized to view this post!',
					success: false,
					data: null,
				};
				return result;
			}

			const postDetails: PostDetails = {
				_id: post._id,
				creator: {
					_id: creator._id,
					firstName: creator.firstName,
					lastName: creator.lastName,
					department: creator.department,
					university: creator.university,
					profilePhotoUrl: creator.profilePhotoUrl,
					friends: creator.friends,
				},
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
				isLiked: post.isLiked(user._id),
			};

			const result: DataResult<PostDetails> = {
				statusCode: 200,
				message: 'Post details fetched!',
				success: true,
				data: postDetails,
			};

			return result;
		} catch (err) {
			if (err instanceof CustomError) {
				return {
					success: false,
					message: err.message,
					data: null,
					statusCode: err.statusCode || 500,
				};
			}

			// In case of an unexpected error, throw a new CustomError
			throw new CustomError('An unexpected error occurred while fetching post details', 500, [err]);
		}
	}
	async getPostById(postId: string, userId: string): Promise<DataResult<Post>> {
		try {
			const post: Post = await this.postRepository.get({ _id: postId });

			if (!post) {
				const result: DataResult<Post> = {
					statusCode: 404,
					message: 'Post not found!',
					success: false,
					data: null,
				};

				return result;
			}

			const user: User = (await this.userService.getUserById(userId)).data;

			//TODO
			const creator: User = (await this.userService.getUserById(userId)).data;

			if (!user.isFriendOrSameUniversity(creator)) {
				const result: DataResult<Post> = {
					statusCode: 403,
					message: 'You are not authorized to view this post!',
					success: false,
					data: null,
				};
				return result;
			}

			return {
				statusCode: 200,
				message: 'Post fetched!',
				success: true,
				data: post,
			};
		} catch (err) {
			err.message = err.message || 'Fetching post failed';
			throw err;
		}
	}

	async likePost(postId: string, userId: string): Promise<DataResult<number>> {
		try {
			const post: Post = await this.postRepository.get({ _id: postId });

			if (!post) {
				const result: DataResult<number> = {
					statusCode: 404,
					message: 'Post not found!',
					success: false,
					data: null,
				};
				return result;
			}

			const user: User = (await this.userService.getUserById(userId)).data;

			if (post.isLiked(user._id)) {
				const result: DataResult<number> = {
					statusCode: 400,
					message: 'Error! You have already liked this post!',
					success: false,
					data: null,
				};
				return result;
			}

			const updatedPost: Post = await this.postRepository.likePost(post._id, user._id);

			const updatedPostLikeCount: number = updatedPost.likes.length;

			const result: DataResult<number> = {
				statusCode: 200,
				message: 'Post liked!',
				success: true,
				data: updatedPostLikeCount,
			};

			return result;
		} catch (err) {
			err.message = err.message || 'Liking post failed';
			throw err;
		}
	}
	async unlikePost(postId: string, userId: string): Promise<DataResult<number>> {
		try {
			const post: Post = await this.postRepository.get({ _id: postId });

			if (!post) {
				const result: DataResult<number> = {
					statusCode: 404,
					message: 'Post not found!',
					success: false,
					data: null,
				};
				return result;
			}

			const user: User = (await this.userService.getUserById(userId)).data;

			if (!post.isLiked(user._id)) {
				const result: DataResult<number> = {
					statusCode: 400,
					message: "You haven't liked this post yet!",
					success: false,
					data: null,
				};
				return result;
			}

			const updatedPost: Post = await this.postRepository.unlikePost(post._id, user._id);

			const updatedPostLikeCount: number = updatedPost.likes.length;

			const result: DataResult<number> = {
				statusCode: 200,
				message: 'Post unliked!',
				success: true,
				data: updatedPostLikeCount,
			};

			return result;
		} catch (err) {
			const error: CustomError = new Error(err.message);
			error.statusCode = 500; // Internal Server Error
			throw error;
		}
	}

	async deletePost(id: string, userId: string): Promise<Result> {
		try {
			const user: User = (await this.userService.getUserById(userId)).data;

			const post: Post = await this.postRepository.get({ _id: id });

			if (!post) {
				const result: Result = {
					statusCode: 404,
					message: 'Post not found!',
					success: false,
				};
				return result;
			}

			if (!post.isAuthor(user._id)) {
				const result: Result = {
					statusCode: 403,
					message: 'You are not authorized to delete this post!',
					success: false,
				};
				return result;
			}

			for (let i = 0; i < post.content.mediaUrls.length; i++) {
				const isDeleted: boolean = await this.cloudinaryService.handleDelete(post.content.mediaUrls[i]);
				if (!isDeleted) {
					const result: Result = {
						statusCode: 500,
						message: 'Post deletion failed!',
						success: false,
					};
					return result;
				}
			}

			const isDeleted: boolean = await this.postRepository.delete(post._id.toString());

			if (!isDeleted) {
				const result: Result = {
					statusCode: 500,
					message: 'Post deletion failed!',
					success: false,
				};
				return result;
			}

			const result: Result = {
				statusCode: 200,
				message: 'Post deleted!',
				success: true,
			};
			return result;
		} catch (err) {
			const error: CustomError = new Error(err.message);
			error.statusCode = 500; // Internal Server Error
			throw error;
		}
	}
}
