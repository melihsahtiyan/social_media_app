import { CloudinaryService } from '../../src/services/cloudinaryService';
import { UserRepository } from '../../src/repositories/user-repository';
import { PostRepository } from '../../src/repositories/post-repository';
import { PostService } from '../../src/services/postService';
import { PostInputDto } from '../../src/models/dtos/post/post-input-dto';
import { User } from '../../src/models/entites/User';
import { PostDoc } from '../../src/models/schemas/post.schema';
import { Schema } from 'mongoose';
import { Post } from '../../src/models/entites/Post';
import { CustomError } from '../../src/types/error/CustomError';

describe('Post Service', () => {
	let postService: PostService;
	let postRepository: PostRepository;
	let userRepository: UserRepository;
	let cloudinaryService: CloudinaryService;

	beforeEach(() => {
		postRepository = new PostRepository();
		userRepository = new UserRepository();
		cloudinaryService = new CloudinaryService();
		postService = new PostService(postRepository, userRepository, cloudinaryService);

		jest.spyOn(userRepository, 'getById').mockImplementation(async () => {
			return new User({
				_id: 'MockId1',
				firstName: 'John',
				lastName: 'Doe',
				email: 'john.doe@example.com',
				password: 'password',
				profilePhotoUrl: 'profilePhotoUrl',
				createdAt: new Date(),
				attendances: [],
				posts: [],
				friends: [],
				friendRequests: [],
				birthDate: new Date(),
				department: 'Computer Science',
				university: 'University of the People',
				status: { emailVerification: true, accountActive: true },
				organizations: [],
				studentEmail: 'studentEmail@example.com',
			});
		});

		jest.spyOn(postRepository, 'getById').mockImplementation(async () => {
			return new Post({
				_id: 'MockId',
				creator: 'MockId1',
				content: {
					caption: 'Caption',
					mediaUrls: ['mediaUrl'],
				},
				likes: ['MockId1'],

				createdAt: new Date(),
				comments: [],
				commentCount: 0,
				poll: null,
				event: null,
				isUpdated: false,
			});
		});
	});

	afterAll(() => {
		jest.clearAllMocks();
	});

	describe('Create Post', () => {
		it('should return an error when media or caption did not provided', async () => {
			const postInput: PostInputDto = {
				caption: '',
			};

			const files: Express.Multer.File[] = [];

			const result = await postService.createPost(postInput, 'MockId', files);

			expect(result.success).toBe(false);
			expect(result.message).toBe('Please provide media or caption!');
		});

		it('should return an error when media is more than 10', async () => {
			const postInput: PostInputDto = {
				caption: 'Caption',
			};

			const files: Express.Multer.File[] = [];

			for (let i = 0; i < 11; i++) {
				files.push({
					buffer: Buffer.from('mockedProfilePhotoUrl', 'utf8'),
					encoding: '7bit',
					mimetype: 'image/jpeg',
					originalname: `image${i}.png`,
					filename: `image${i}.png`,
					fieldname: 'profilePhoto',
					path: 'uploads/mockedProfilePhotoUrl',
					stream: null,
					size: 10000,
					destination: 'uploads/',
				});
			}

			const result = await postService.createPost(postInput, 'MockId', files);

			expect(result.success).toBe(false);
			expect(result.message).toBe('You can upload up to 10 media files!');
		});

		it('should create a post successfully with valid data', async () => {
			const postInput: PostInputDto = {
				caption: 'Caption',
			};

			const files: Express.Multer.File[] = [];

			files.push({
				buffer: Buffer.from('mockedProfilePhotoUrl', 'utf8'),
				encoding: '7bit',
				mimetype: 'image/jpeg',
				originalname: `image.png`,
				filename: `image.png`,
				fieldname: 'profilePhoto',
				path: 'uploads/mockedProfilePhotoUrl',
				stream: null,
				size: 10000,
				destination: 'uploads/',
			});

			jest.spyOn(cloudinaryService, 'handleUpload').mockImplementation(async () => {
				return 'publicId';
			});

			jest.spyOn(postRepository, 'createPost').mockImplementation(async () => {
				return {
					_id: 'MockId',
					creator: new Schema.Types.ObjectId('MockId'),
					content: {
						caption: 'Caption',
						mediaUrls: ['mediaUrl'],
					},
					likes: [],

					createdAt: new Date(),
					comments: [],
					commentCount: 0,
					poll: null,
					event: null,
					isUpdated: false,
				} as PostDoc;
			});

			const result = await postService.createPost(postInput, 'MockId', files);

			expect(result.success).toBe(true);
			expect(result.message).toBe('Post created!');
		});
	});

	describe('Get All Posts', () => {
		it('should return all posts successfully', async () => {
			jest.spyOn(postRepository, 'getAllPopulatedPosts').mockImplementation(async () => {
				return [
					{
						_id: 'MockId',
						creator: new Schema.Types.ObjectId('MockId'),
						content: {
							caption: 'Caption',
							mediaUrls: ['mediaUrl'],
						},
						likes: [],
						createdAt: new Date(),
						comments: [],
						commentCount: 0,
						poll: null,
						event: null,
						isUpdated: false,
					} as PostDoc,
				];
			});

			const result = await postService.getAllPosts();

			expect(result.success).toBe(true);
			expect(result.data.length).toBe(1);
		});
	});

	describe('Get All Friends Posts', () => {
		it('should return all friends posts successfully', async () => {
			jest.spyOn(postRepository, 'getFriendsPosts').mockImplementation(async () => {
				return [
					new Post({
						_id: 'MockId',
						creator: new Schema.Types.ObjectId('MockId1'),
						content: {
							caption: 'Caption',
							mediaUrls: ['mediaUrl'],
						},
						likes: [],

						createdAt: new Date(),
						comments: [],
						commentCount: 0,
						poll: null,
						event: null,
						isUpdated: false,
					}),
				];
			});

			const result = await postService.getAllFriendsPosts('MockId');

			expect(result.success).toBe(true);
			expect(result.data.length).toBe(1);
		});
	});

	describe('Get All University Posts', () => {
		it('should return all university posts successfully', async () => {
			jest.spyOn(postRepository, 'getAllUniversityPosts').mockImplementation(async () => {
				return [
					new Post({
						_id: 'MockId',
						creator: new Schema.Types.ObjectId('MockId1'),
						content: {
							caption: 'Caption',
							mediaUrls: ['mediaUrl'],
						},
						likes: [],

						createdAt: new Date(),
						comments: [],
						commentCount: 0,
						poll: null,
						event: null,
						isUpdated: false,
					}),
				];
			});

			const result = await postService.getAllUniversityPosts('MockId');

			expect(result.success).toBe(true);
			expect(result.data.length).toBe(1);
		});
	});

	describe('Get Post Details', () => {
		it('should return an error when post not found', async () => {
			jest.spyOn(postRepository, 'getById').mockImplementationOnce(async () => {
				throw new CustomError('Post not found', 404);
			});

			const result = await postService.getPostDetails('MockId', 'MockId');

			expect(result.success).toBe(false);
			expect(result.message).toBe('Post not found');
		});

		it('should return an error when post creator is not a friend or university member', async () => {
			jest.spyOn(userRepository, 'getById').mockImplementationOnce(async () => {
				return new User({
					_id: 'MockId1',
					firstName: 'John',
					lastName: 'Doe',
					email: 'john.doe@example.com',
					password: 'password',
					profilePhotoUrl: 'profilePhotoUrl',
					createdAt: new Date(),
					attendances: [],
					posts: [],
					friends: [],
					friendRequests: [],
					birthDate: new Date(),
					department: 'Computer Science',
					university: 'University of the People',
					status: { emailVerification: true, accountActive: true },
					organizations: [],
					studentEmail: 'studentEmail@example.com',
				});
			});

			jest.spyOn(userRepository, 'getById').mockImplementationOnce(async () => {
				return new User({
					_id: 'MockId2',
					firstName: 'Jane',
					lastName: 'Doe',
					email: 'jane.doe@example.com',
					password: 'password',
					profilePhotoUrl: 'profilePhotoUrl',
					createdAt: new Date(),
					attendances: [],
					posts: [],
					friends: [],
					friendRequests: [],
					birthDate: new Date(),
					department: 'Computer Science',
					university: 'University of the Mock',
					status: { emailVerification: true, accountActive: true },
					organizations: [],
					studentEmail: 'studentEmail@example.com',
				});
			});

			const result = await postService.getPostDetails('MockId', 'MockId2');

			expect(result.success).toBe(false);
			expect(result.message).toBe('You are not authorized to view this post!');
			expect(result.statusCode).toBe(403);
		});

		it('should return post details successfully', async () => {
			jest.spyOn(userRepository, 'getById').mockImplementationOnce(async () => {
				return new User({
					_id: 'MockId1',
					firstName: 'John',
					lastName: 'Doe',
					email: 'john.doe@example.com',
					password: 'password',
					profilePhotoUrl: 'profilePhotoUrl',
					createdAt: new Date(),
					attendances: [],
					posts: [],
					friends: ['MockId2'],
					friendRequests: [],
					birthDate: new Date(),
					department: 'Computer Science',
					university: 'University of the People',
					status: { emailVerification: true, accountActive: true },
					organizations: [],
					studentEmail: 'studentEmail@example.com',
				});
			});

			jest.spyOn(userRepository, 'getById').mockImplementationOnce(async () => {
				return new User({
					_id: 'MockId2',
					firstName: 'Jane',
					lastName: 'Doe',
					email: 'jane.doe@example.com',
					password: 'password',
					profilePhotoUrl: 'profilePhotoUrl',
					createdAt: new Date(),
					attendances: [],
					posts: [],
					friends: ['MockId1'],
					friendRequests: [],
					birthDate: new Date(),
					department: 'Computer Science',
					university: 'University of the Mock',
					status: { emailVerification: true, accountActive: true },
					organizations: [],
					studentEmail: 'studentEmail@example.com',
				});
			});

			const result = await postService.getPostDetails('MockId', 'MockId2');

			expect(result.message).toBe('Post details fetched!');
			expect(result.success).toBe(true);
			expect(result.data).not.toBeNull();
			expect(result.data.isLiked).toBe(false);
			expect(result.statusCode).toBe(200);
		});

		it('should return post details successfully by the creator', async () => {
			jest.spyOn(userRepository, 'getById').mockImplementationOnce(async () => {
				return new User({
					_id: 'MockId1',
					firstName: 'John',
					lastName: 'Doe',
					email: 'john.doe@example.com',
					password: 'password',
					profilePhotoUrl: 'profilePhotoUrl',
					createdAt: new Date(),
					attendances: [],
					posts: [],
					friends: ['MockId2'],
					friendRequests: [],
					birthDate: new Date(),
					department: 'Computer Science',
					university: 'University of the People',
					status: { emailVerification: true, accountActive: true },
					organizations: [],
					studentEmail: 'studentEmail@example.com',
				});
			});

			jest.spyOn(userRepository, 'getById').mockImplementationOnce(async () => {
				return new User({
					_id: 'MockId1',
					firstName: 'John',
					lastName: 'Doe',
					email: 'john.doe@example.com',
					password: 'password',
					profilePhotoUrl: 'profilePhotoUrl',
					createdAt: new Date(),
					attendances: [],
					posts: [],
					friends: ['MockId2'],
					friendRequests: [],
					birthDate: new Date(),
					department: 'Computer Science',
					university: 'University of the People',
					status: { emailVerification: true, accountActive: true },
					organizations: [],
					studentEmail: 'studentEmail@example.com',
				});
			});

			const result = await postService.getPostDetails('MockId', 'MockId1');

			expect(result.message).toBe('Post details fetched!');
			expect(result.success).toBe(true);
			expect(result.data).not.toBeNull();
		});
	});

	describe('Get Post By Id', () => {
		it('should return an error when post not found', async () => {
			jest.spyOn(postRepository, 'getById').mockImplementationOnce(async () => {
				return null;
			});

			const result = await postService.getPostById('MockId', 'MockId1');

			expect(result.success).toBe(false);
			expect(result.message).toBe('Post not found!');
		});

		it('should return an error when post creator is not a friend or university member', async () => {
			jest.spyOn(userRepository, 'getById').mockImplementationOnce(async () => {
				return new User({
					_id: 'MockId2',
					firstName: 'Jane',
					lastName: 'Doe',
					email: 'jane.doe@example.com',
					password: 'password',
					profilePhotoUrl: 'profilePhotoUrl',
					createdAt: new Date(),
					attendances: [],
					posts: [],
					friends: [],
					friendRequests: [],
					birthDate: new Date(),
					department: 'Computer Science',
					university: 'University of the Mock',
					status: { emailVerification: true, accountActive: true },
					organizations: [],
					studentEmail: 'studentEmail@example.com',
				});
			});

			jest.spyOn(userRepository, 'getById').mockImplementationOnce(async () => {
				return new User({
					_id: 'MockId1',
					firstName: 'John',
					lastName: 'Doe',
					email: 'john.doe@example.com',
					password: 'password',
					profilePhotoUrl: 'profilePhotoUrl',
					createdAt: new Date(),
					attendances: [],
					posts: [],
					friends: [],
					friendRequests: [],
					birthDate: new Date(),
					department: 'Computer Science',
					university: 'University of the People',
					status: { emailVerification: true, accountActive: true },
					organizations: [],
					studentEmail: 'studentEmail@example.com',
				});
			});

			const result = await postService.getPostDetails('MockId', 'MockId2');

			expect(result.message).toBe('You are not authorized to view this post!');
			expect(result.success).toBe(false);
			expect(result.statusCode).toBe(403);
		});

		it('should return post details successfully', async () => {
			jest.spyOn(userRepository, 'getById').mockImplementation(async () => {
				return new User({
					_id: 'MockId1',
					firstName: 'John',
					lastName: 'Doe',
					email: 'john.doe@example.com',
					password: 'password',
					profilePhotoUrl: 'profilePhotoUrl',
					createdAt: new Date(),
					attendances: [],
					posts: [],
					friends: [],
					friendRequests: [],
					birthDate: new Date(),
					department: 'Computer Science',
					university: 'University of the People',
					status: { emailVerification: true, accountActive: true },
					organizations: [],
					studentEmail: 'studentEmail@example.com',
				});
			});

			jest.spyOn(userRepository, 'getById').mockImplementation(async () => {
				return new User({
					_id: 'MockId1',
					firstName: 'John',
					lastName: 'Doe',
					email: 'john.doe@example.com',
					password: 'password',
					profilePhotoUrl: 'profilePhotoUrl',
					createdAt: new Date(),
					attendances: [],
					posts: [],
					friends: [],
					friendRequests: [],
					birthDate: new Date(),
					department: 'Computer Science',
					university: 'University of the People',
					status: { emailVerification: true, accountActive: true },
					organizations: [],
					studentEmail: 'studentEmail@example.com',
				});
			});

			const result = await postService.getPostById('MockId', 'MockId1');

			expect(result.message).toBe('Post fetched!');
			expect(result.success).toBe(true);
			expect(result.statusCode).toBe(200);
			expect(result.data.isLiked).toBe(true);
		});
	});

	describe('Like Post', () => {
		it('should return an error when post not found', async () => {
			jest.spyOn(postRepository, 'getById').mockImplementationOnce(async () => {
				return null;
			});

			const result = await postService.likePost('MockId', 'MockId1');

			expect(result.success).toBe(false);
			expect(result.message).toBe('Post not found!');
		});

		it('should return an error when user has already liked the post', async () => {
			jest.spyOn(postRepository, 'getById').mockImplementationOnce(async () => {
				return new Post({
					_id: 'MockId',
					creator: 'MockId1',
					content: {
						caption: 'Caption',
						mediaUrls: ['mediaUrl'],
					},
					likes: ['MockId1'],

					createdAt: new Date(),
					comments: [],
					commentCount: 0,
					poll: null,
					event: null,
					isUpdated: true,
				});
			});
			const result = await postService.likePost('MockId', 'MockId1');

			expect(result.success).toBe(false);
			expect(result.message).toBe('Error! You have already liked this post!');
		});

		it('should like post successfully', async () => {
			jest.spyOn(postRepository, 'getById').mockImplementation(async () => {
				return new Post({
					_id: 'MockId',
					creator: 'MockId1',
					content: {
						caption: 'Caption',
						mediaUrls: ['mediaUrl'],
					},
					likes: [],

					createdAt: new Date(),
					comments: [],
					commentCount: 0,
					poll: null,
					event: null,
					isUpdated: false,
				});
			});

			jest.spyOn(postRepository, 'likePost').mockImplementation(async () => {
				return new Post({
					_id: 'MockId',
					creator: 'MockId1',
					content: {
						caption: 'Caption',
						mediaUrls: ['mediaUrl'],
					},
					likes: ['MockId1'],

					createdAt: new Date(),
					comments: [],
					commentCount: 0,
					poll: null,
					event: null,
					isUpdated: false,
				});
			});

			const result = await postService.likePost('MockId', 'MockId1');

			expect(result.success).toBe(true);
			expect(result.message).toBe('Post liked!');
		});
	});

	describe('Unlike Post', () => {
		it("should return an error when user hasn't liked the post", async () => {
			jest.spyOn(postRepository, 'getById').mockImplementationOnce(async () => {
				return new Post({
					_id: 'MockId',
					creator: 'MockId1',
					content: {
						caption: 'Caption',
						mediaUrls: ['mediaUrl'],
					},
					likes: [],

					createdAt: new Date(),
					comments: [],
					commentCount: 0,
					poll: null,
					event: null,
					isUpdated: false,
				});
			});

			const result = await postService.unlikePost('MockId', 'MockId1');

			expect(result.message).toBe("You haven't liked this post yet!");
			expect(result.success).toBe(false);
		});

		it('should unlike post successfully', async () => {
			jest.spyOn(postRepository, 'getById').mockImplementationOnce(async () => {
				return new Post({
					_id: 'MockId',
					creator: 'MockId1',
					content: {
						caption: 'Caption',
						mediaUrls: ['mediaUrl'],
					},
					likes: ['MockId1'],

					createdAt: new Date(),
					comments: [],
					commentCount: 0,
					poll: null,
					event: null,
					isUpdated: false,
				});
			});

			jest.spyOn(postRepository, 'unlikePost').mockImplementationOnce(async () => {
				return new Post({
					_id: 'MockId',
					creator: 'MockId1',
					content: {
						caption: 'Caption',
						mediaUrls: ['mediaUrl'],
					},
					likes: [],

					createdAt: new Date(),
					comments: [],
					commentCount: 0,
					poll: null,
					event: null,
					isUpdated: false,
				});
			});

			const result = await postService.unlikePost('MockId', 'MockId1');

			expect(result.success).toBe(true);
			expect(result.message).toBe('Post unliked!');
		});
	});

	describe('Delete Post', () => {
		it('should return an error when post not found', async () => {
			jest.spyOn(postRepository, 'getById').mockImplementationOnce(async () => {
				return null;
			});

			const result = await postService.deletePost('MockId', 'MockId1');

			expect(result.success).toBe(false);
			expect(result.message).toBe('Post not found!');
		});

		it('should return an error when user is not the creator of the post', async () => {
			jest.spyOn(postRepository, 'getById').mockImplementationOnce(async () => {
				return new Post({
					_id: 'MockId',
					creator: 'MockId2',
					content: {
						caption: 'Caption',
						mediaUrls: ['mediaUrl'],
					},
					likes: [],

					createdAt: new Date(),
					comments: [],
					commentCount: 0,
					poll: null,
					event: null,
					isUpdated: false,
				});
			});

			const result = await postService.deletePost('MockId', 'MockId2');

			expect(result.success).toBe(false);
			expect(result.message).toBe('You are not authorized to delete this post!');
		});

		it('should return an error when media files cannot be deleted', async () => {
			jest.spyOn(postRepository, 'getById').mockImplementationOnce(async () => {
				return new Post({
					_id: 'MockId',
					creator: 'MockId1',
					content: {
						caption: 'Caption',
						mediaUrls: ['mediaUrl', 'mediaUrl1'],
					},
					likes: [],

					createdAt: new Date(),
					comments: [],
					commentCount: 0,
					poll: null,
					event: null,
					isUpdated: false,
				});
			});

			jest.spyOn(cloudinaryService, 'handleDelete').mockImplementationOnce(async () => {
				return true;
			});

			jest.spyOn(cloudinaryService, 'handleDelete').mockImplementationOnce(async () => {
				return false;
			});

			const result = await postService.deletePost('MockId', 'MockId1');

			expect(result.success).toBe(false);
			expect(result.message).toBe('Post deletion failed!');
		});

		it('should delete post successfully', async () => {
			jest.spyOn(postRepository, 'getById').mockImplementationOnce(async () => {
				return new Post({
					_id: 'MockId',
					creator: 'MockId1',
					content: {
						caption: 'Caption',
						mediaUrls: ['mediaUrl', 'mediaUrl1'],
					},
					likes: [],

					createdAt: new Date(),
					comments: [],
					commentCount: 0,
					poll: null,
					event: null,
					isUpdated: false,
				});
			});

			jest.spyOn(cloudinaryService, 'handleDelete').mockImplementation(async () => {
				return true;
			});

			jest.spyOn(postRepository, 'deletePost').mockImplementation(async () => {
				return true;
			});

			const result = await postService.deletePost('MockId', 'MockId1');

			expect(result.success).toBe(true);
			expect(result.message).toBe('Post deleted!');
		});
	});
});
