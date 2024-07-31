import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import IPostService from '../types/services/IPostService';
import { PostRepository } from '../repositories/post-repository';
import { CloudinaryService } from './cloudinaryService';
import { UserRepository } from '../repositories/user-repository';
import { CustomError } from '../types/error/CustomError';
import { PostDoc } from '../models/schemas/post.schema';
import { PostInputDto } from '../models/dtos/post/post-input-dto';
import PostList from '../models/dtos/post/post-list';
import { DataResult } from '../types/result/DataResult';
import { PostForCreate } from '../models/dtos/post/post-for-create';
import { PostDetails } from '../models/dtos/post/post-details';
import { PostForLike } from '../models/dtos/post/post-for-like';
import { Post } from '../models/entites/Post';
import { Result } from '../types/result/Result';
import { User } from '../models/entites/User';

@injectable()
export class PostService implements IPostService {
	private postRepository: PostRepository;
	private userRepository: UserRepository;
	private cloudinaryService: CloudinaryService;
	constructor(
		@inject(PostRepository) postRepository: PostRepository,
		@inject(UserRepository) userRepository: UserRepository,
		@inject(CloudinaryService) cloudinaryService: CloudinaryService
	) {
		this.postRepository = postRepository;
		this.userRepository = userRepository;
		this.cloudinaryService = cloudinaryService;
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
					message: 'Post must have content or media!',
					success: false,
					data: null
				};
				return result;
			}

			const user: User = await this.userRepository.getById(userId);

			let sourceUrls: string[] = [];

			if (files) {
				// TODO: create cloudinary service
				if (files.length > 10) {
					const result: DataResult<PostInputDto> = {
						statusCode: 422,
						message: 'Too many files!',
						success: false,
						data: null
					};
					return result;
				}

				if (files.length > 0) {
					sourceUrls = await Promise.all(
						files.map(async (file) => {
							const extension = file.mimetype.split('/')[1];
							const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'm4v'];
							const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'gif'];

							let folder: string;
							if (videoExtensions.includes(extension)) {
								folder = 'media/videos/';
							} else if (imageExtensions.includes(extension)) {
								folder = 'media/images/';
							} else {
								const error: CustomError = new Error('Invalid file type!');
								error.statusCode = 422;
								throw error;
							}

							const fileBuffer = file.buffer.toString('base64');
							const dataURI = 'data:' + file.mimetype + ';base64,' + fileBuffer;

							const publicId: string = await this.cloudinaryService.handleUpload(dataURI, folder);
							return publicId;
						})
					);
				}
			}

			const postForCreate: PostForCreate = {
				creator: user._id,
				content: {
					caption: postInput.caption,
					mediaUrls: sourceUrls
				},
				poll: null
			};

			await this.postRepository.createPost(postForCreate);

			const result: DataResult<PostInputDto> = {
				statusCode: 201,
				message: 'Post created!',
				success: true,
				data: postInput
			};

			return result;
		} catch (err) {
			const error: CustomError = new Error(err);
			error.statusCode = err?.statusCode || 500;

			throw err;
		}
	}

	async getAllPosts(): Promise<DataResult<Array<PostDoc>>> {
		try {
			const posts: PostDoc[] = await this.postRepository.getAllPosts();

			const result: DataResult<Array<PostDoc>> = {
				statusCode: 200,
				message: 'Posts fetched!',
				success: true,
				data: posts
			};

			return result;
		} catch (err) {
			const error: CustomError = new Error(err);
			throw error;
		}
	}

	async getAllFriendsPosts(userId: string): Promise<DataResult<Array<PostList>>> {
		try {
			const user: User = await this.userRepository.getById(userId);

			const posts: PostDoc[] = await this.postRepository.getFriendsPosts(user._id);

			const postList: PostList[] = posts.map((post) => {
				const postForList: PostList = {
					_id: post._id,
					creator: post.creator,
					content: {
						caption: post.content.caption,
						mediaUrls: post.content.mediaUrls
					},
					likes: post.likes,
					comments: post.comments,
					poll: post.poll,
					isUpdated: post.isUpdated,
					createdAt: post.createdAt,
					isLiked: post.isLiked(user._id)
				};
				return postForList;
			});

			const result: DataResult<Array<PostList>> = {
				statusCode: 200,
				message: 'Following posts fetched!',
				success: true,
				data: postList
			};
			return result;
		} catch (err) {
			const error: CustomError = new Error(err);
			throw error;
		}
	}
	async getAllUniversityPosts(userId: string): Promise<DataResult<Array<PostList>>> {
		try {
			const user: User = await this.userRepository.getById(userId);
			const posts: Array<Post> = await this.postRepository.getAllUniversityPosts(user.university);

			const postList: Array<PostList> = posts.map((post) => {
				const postForList: PostList = {
					_id: post._id,
					creator: post.creator,
					content: {
						caption: post.content.caption,
						mediaUrls: post.content.mediaUrls
					},
					likes: post.likes,
					comments: post.comments,
					poll: post.poll,
					isUpdated: post.isUpdated,
					createdAt: post.createdAt,
					isLiked: post.isLiked(user._id)
				};
				return postForList;
			});

			const result: DataResult<Array<PostList>> = {
				statusCode: 200,
				message: 'University posts fetched!',
				success: true,
				data: postList
			};

			return result;
		} catch (err) {
			const error: CustomError = new Error(err);
			throw error;
		}
	}
	async getPostDetails(postId: string, userId: string): Promise<DataResult<PostDetails>> {
		try {
			const post: Post = await this.postRepository.getById(postId);

			if (!post) {
				const result: DataResult<PostDetails> = {
					statusCode: 404,
					message: 'Post not found!',
					success: false,
					data: null
				};
				return result;
			}

			const creator: User = await this.userRepository.getById(post.getCreatorId());

			const user: User = (await this.userRepository.getById(userId)) as User;

			if (user.isFriendOrSameUniversity(creator)) {
				const result: DataResult<PostDetails> = {
					statusCode: 403,
					message: 'You are not authorized to view this post!',
					success: false,
					data: null
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
					friends: creator.friends
				},
				content: {
					caption: post.content.caption,
					mediaUrls: post.content.mediaUrls
				},
				poll: post.poll,
				likes: post.likes,
				comments: post.comments,
				createdAt: post.createdAt,
				commentCount: post.comments.length,
				likeCount: post.likes.length,
				isUpdated: post.isUpdated,
				isLiked: post.isLiked(user._id)
			};

			const result: DataResult<PostDetails> = {
				statusCode: 200,
				message: 'Post details fetched!',
				success: true,
				data: postDetails
			};

			return result;
		} catch (err) {
			const error: CustomError = new Error(err);
			throw error;
		}
	}
	async getPostById(postId: string, userId: string): Promise<DataResult<PostDetails>> {
		try {
			const post: Post = await this.postRepository.getById(postId);

			if (!post) {
				const error: CustomError = new Error('Post not found!');
				error.statusCode = 404;
				throw error;
			}

			const user: User = await this.userRepository.getById(userId);

			//TODO
			const creator: User = await this.userRepository.getById(post.getCreatorId());

			if (user.isFriendOrSameUniversity(creator)) {
				const error: CustomError = new Error('You are not authorized to view this post!');
				error.statusCode = 403;
				throw error;
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
					friends: creator.friends
				},
				content: {
					caption: post.content.caption,
					mediaUrls: post.content.mediaUrls
				},
				poll: post.poll,
				likes: post.likes,
				comments: post.comments,
				createdAt: post.createdAt,
				commentCount: post.comments.length,
				likeCount: post.likes.length,
				isUpdated: post.isUpdated,
				isLiked: post.isLiked(user._id)
			};

			const result: DataResult<PostDetails> = {
				statusCode: 200,
				message: 'Post fetched!',
				success: true,
				data: postDetails
			};

			return result;
		} catch (err) {
			err.message = err.message || 'Fetching post failed';
			throw err;
		}
	}

	async likePost(postId: string, userId: string): Promise<DataResult<PostForLike>> {
		try {
			const post: Post = await this.postRepository.getById(postId);
			const user: User = await this.userRepository.getById(userId);

			if (post.isLiked(user._id)) {
				const result: DataResult<PostForLike> = {
					statusCode: 400,
					message: 'You already liked this post!',
					success: false,
					data: null
				};
				return result;
			}

			const updatedPost: PostForLike = (await this.postRepository.likePost(post._id, user._id)) as PostForLike;

			const result: DataResult<PostForLike> = {
				statusCode: 200,
				message: 'Post liked!',
				success: true,
				data: updatedPost
			};

			return result;
		} catch (err) {
			err.message = err.message || 'Liking post failed';
			throw err;
		}
	}
	async unlikePost(postId: string, userId: string): Promise<DataResult<PostForLike>> {
		try {
			const post: PostDetails = await this.postRepository.getPostById(postId);
			const user: User = await this.userRepository.getById(userId);

			const updatedPost: PostForLike = (await this.postRepository.unlikePost(post._id, user._id)) as PostForLike;

			const result: DataResult<PostForLike> = {
				statusCode: 200,
				message: 'Post unliked!',
				success: true,
				data: updatedPost
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
			const user: User = await this.userRepository.getById(userId);

			if (!user) {
				const result: Result = {
					statusCode: 404,
					message: 'User not found!',
					success: false
				};
				return result;
			}

			const post: Post = await this.postRepository.getById(id);

			if (!post) {
				const result: Result = {
					statusCode: 404,
					message: 'Post not found!',
					success: false
				};
				return result;
			}

			if (post.isAuthor(userId)) {
				const result: Result = {
					statusCode: 403,
					message: 'You are not authorized to delete this post!',
					success: false
				};
				return result;
			}

			post.content.mediaUrls.forEach(async (url) => {
				const isDeleted: boolean = await this.cloudinaryService.handleDelete(url);
				if (!isDeleted) {
					const result: Result = {
						statusCode: 500,
						message: 'Profile photo deletion error!',
						success: false
					};
					return result;
				}
			});

			const isDeleted: boolean = await this.postRepository.deletePost(id);

			if (!isDeleted) {
				const result: Result = {
					statusCode: 500,
					message: 'Post deletion failed!',
					success: false
				};
				return result;
			}

			const result: Result = {
				statusCode: 200,
				message: 'Post deleted!',
				success: true
			};
			return result;
		} catch (err) {
			const error: CustomError = new Error(err.message);
			error.statusCode = 500; // Internal Server Error
			throw error;
		}
	}
}
