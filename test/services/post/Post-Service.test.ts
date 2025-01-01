import { CloudinaryService } from '../../../src/application/services/cloudinary.service';
import { PostService } from '../../../src/application/services/post.service';
import { PostInputDto } from '../../../src/models/dtos/post/post-input-dto';
import { Post } from '../../../src/models/entities/Post';
import { User } from '../../../src/models/entities/User';
import { PostDoc } from '../../../src/models/schemas/post.schema';
import { PostRepository } from '../../../src/persistence/repositories/post-repository';
import { UserRepository } from '../../../src/persistence/repositories/user-repository';
import { postMocks } from './post.mocks';

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

		jest.spyOn(userRepository, 'get').mockImplementation(async () => {
			return postMocks.userMocks.validUserMocks[0];
		});

		jest.spyOn(postRepository, 'get').mockImplementation(async () => {
			return postMocks.post[0] as PostDoc;
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

			jest.spyOn(postRepository, 'create').mockImplementation(async () => {
				return true;
			});

			const result = await postService.createPost(postInput, 'MockId', files);

			expect(result.success).toBe(true);
			expect(result.message).toBe('Post created!');
		});
	});

	describe('Get All Posts', () => {
		it('should return all posts successfully', async () => {
			jest.spyOn(postRepository, 'getAllPopulatedPosts').mockImplementation(async () => {
				return postMocks.post as PostDoc[];
			});

			const result = await postService.getAllPosts();

			expect(result.success).toBe(true);
			expect(result.data.length).toBe(2);
		});
	});

	describe('Get All Friends Posts', () => {
		it('should return all friends posts successfully', async () => {
			jest.spyOn(postRepository, 'getAll').mockResolvedValue([postMocks.post[1] as PostDoc]);

			const result = await postService.getAllFriendsPosts('MockId');

			expect(result.success).toBe(true);
			expect(result.data.length).toBe(1);
		});
	});

	describe('Get All University Posts', () => {
		it('should return all university posts successfully', async () => {
			jest.spyOn(postRepository, 'getAllUniversityPosts').mockImplementation(async () => {
				return [postMocks.post[0] as PostDoc];
			});

			const result = await postService.getAllUniversityPosts('MockId');

			expect(result.success).toBe(true);
			expect(result.data.length).toBe(1);
		});
	});

	describe('Get Post Details', () => {
		it('should return an error when post not found', async () => {
			jest.spyOn(postRepository, 'get').mockResolvedValue(null);

			const result = await postService.getPostDetails('MockId', 'MockId');

			expect(result.success).toBe(false);
			expect(result.message).toBe('Post not found!');
		});

		it('should return an error when post creator is not a friend or university member', async () => {
			jest.spyOn(postRepository, 'get').mockResolvedValue(postMocks.post[0]);
			jest.spyOn(userRepository, 'get').mockResolvedValue(postMocks.userMocks.validUserMocks[0]);

			jest.spyOn(userRepository, 'get').mockResolvedValue(postMocks.userMocks.validUserMocks[1]);

			jest.spyOn(User.prototype, 'isFriendOrSameUniversity').mockReturnValue(false);

			const result = await postService.getPostDetails('MockId', 'MockId2');

			expect(result.success).toBe(false);
			expect(result.message).toBe('You are not authorized to view this post!');
			expect(result.statusCode).toBe(403);
		});

		it('should return post details successfully', async () => {
			jest.spyOn(postRepository, 'get').mockResolvedValue(postMocks.post[0]);

			jest.spyOn(userRepository, 'get').mockResolvedValue(postMocks.userMocks.validUserMocks[0]);
			jest.spyOn(userRepository, 'get').mockResolvedValue(postMocks.userMocks.validUserMocks[1]);

			jest.spyOn(User.prototype, 'isFriendOrSameUniversity').mockReturnValue(true);

			const result = await postService.getPostDetails('MockId', 'MockId2');

			expect(result.message).toBe('Post details fetched!');
			expect(result.success).toBe(true);
			expect(result.data).not.toBeNull();
			expect(result.statusCode).toBe(200);
		});

		//TODO: Look into this test
		it('should return post details successfully by the creator', async () => {
			jest.spyOn(postRepository, 'get').mockResolvedValue(postMocks.post[0]);

			jest.spyOn(userRepository, 'get').mockResolvedValue(postMocks.userMocks.validUserMocks[0]);
			jest.spyOn(userRepository, 'get').mockResolvedValue(postMocks.userMocks.validUserMocks[0]);

			jest.spyOn(User.prototype, 'isFriendOrSameUniversity').mockReturnValue(true);

			const result = await postService.getPostDetails('MockId', 'MockId1');

			expect(result.message).toBe('Post details fetched!');
			expect(result.success).toBe(true);
			expect(result.data).not.toBeNull();
		});
	});

	describe('Get Post By Id', () => {
		it('should return an error when post not found', async () => {
			jest.spyOn(postRepository, 'get').mockResolvedValue(null);

			const result = await postService.getPostById('MockId', 'MockId1');

			expect(result.success).toBe(false);
			expect(result.message).toBe('Post not found!');
		});

		it('should return an error when post creator is not a friend or university member', async () => {
			jest.spyOn(postRepository, 'get').mockResolvedValue(postMocks.post[0]);

			jest.spyOn(userRepository, 'get').mockResolvedValue(postMocks.userMocks.validUserMocks[0]);

			jest.spyOn(userRepository, 'get').mockResolvedValue(postMocks.userMocks.validUserMocks[1]);

			jest.spyOn(User.prototype, 'isFriendOrSameUniversity').mockReturnValue(false);

			const result = await postService.getPostDetails('MockId', 'MockId2');

			expect(result.message).toBe('You are not authorized to view this post!');
			expect(result.success).toBe(false);
			expect(result.statusCode).toBe(403);
		});

		it('should return post details successfully', async () => {
			jest.spyOn(postRepository, 'get').mockResolvedValue(postMocks.post[0]);
			jest.spyOn(userRepository, 'get').mockResolvedValue(postMocks.userMocks.validUserMocks[0]);

			jest.spyOn(userRepository, 'get').mockResolvedValue(postMocks.userMocks.validUserMocks[1]);

			jest.spyOn(User.prototype, 'isFriendOrSameUniversity').mockReturnValue(true);

			const result = await postService.getPostById('MockId', 'MockId1');

			expect(result.message).toBe('Post fetched!');
			expect(result.success).toBe(true);
			expect(result.statusCode).toBe(200);
		});
	});

	describe('Like Post', () => {
		it('should return an error when post not found', async () => {
			jest.spyOn(postRepository, 'get').mockResolvedValue(null);

			const result = await postService.likePost('MockId', 'MockId1');

			expect(result.success).toBe(false);
			expect(result.message).toBe('Post not found!');
		});

		it('should return an error when user has already liked the post', async () => {
			jest.spyOn(postRepository, 'get').mockResolvedValue(postMocks.post[0]);

			jest.spyOn(userRepository, 'get').mockResolvedValue(postMocks.userMocks.validUserMocks[0]);

			jest.spyOn(Post.prototype, 'isLiked').mockReturnValue(true);

			const result = await postService.likePost('MockId', 'MockId1');

			expect(result.success).toBe(false);
			expect(result.message).toBe('Error! You have already liked this post!');
		});

		it('should like post successfully', async () => {
			jest.spyOn(postRepository, 'get').mockResolvedValue(postMocks.post[1]);

			jest.spyOn(postRepository, 'likePost').mockResolvedValue(postMocks.post[0]);

			jest.spyOn(Post.prototype, 'isLiked').mockReturnValue(false);

			const result = await postService.likePost('MockId', 'MockId1');

			expect(result.success).toBe(true);
			expect(result.message).toBe('Post liked!');
		});
	});

	describe('Unlike Post', () => {
		it("should return an error when user hasn't liked the post", async () => {
			jest.spyOn(postRepository, 'get').mockResolvedValue(postMocks.post[1]);

			const result = await postService.unlikePost('MockId', 'MockId1');

			expect(result.message).toBe("You haven't liked this post yet!");
			expect(result.success).toBe(false);
		});

		it('should unlike post successfully', async () => {
			jest.spyOn(postRepository, 'get').mockResolvedValue(postMocks.post[0]);

			jest.spyOn(userRepository, 'get').mockResolvedValue(postMocks.userMocks.validUserMocks[0]);

			jest.spyOn(Post.prototype, 'isLiked').mockReturnValue(true);

			jest.spyOn(postRepository, 'unlikePost').mockResolvedValue(postMocks.post[1] as PostDoc);

			const result = await postService.unlikePost('MockId', 'MockId1');

			expect(result.message).toBe('Post unliked!');
			expect(result.success).toBe(true);
		});
	});

	describe('Delete Post', () => {
		it('should return an error when post not found', async () => {
			jest.spyOn(postRepository, 'get').mockResolvedValue(null);

			const result = await postService.deletePost('MockId', 'MockId1');

			expect(result.success).toBe(false);
			expect(result.message).toBe('Post not found!');
		});

		it('should return an error when user is not the creator of the post', async () => {
			jest.spyOn(postRepository, 'get').mockResolvedValue(postMocks.post[0]);

			jest.spyOn(Post.prototype, 'isAuthor').mockReturnValueOnce(false);

			const result = await postService.deletePost('MockId', 'MockId2');

			expect(result.success).toBe(false);
			expect(result.message).toBe('You are not authorized to delete this post!');
		});

		it('should return an error when media files cannot be deleted', async () => {
			jest.spyOn(userRepository, 'get').mockResolvedValue(postMocks.userMocks.validUserMocks[0]);

			jest.spyOn(postRepository, 'get').mockResolvedValue(postMocks.post[0]);

			jest.spyOn(Post.prototype, 'isAuthor').mockReturnValue(true);

			jest.spyOn(cloudinaryService, 'handleDelete').mockResolvedValue(false);

			const result = await postService.deletePost('MockId', 'MockId1');

			expect(result.success).toBe(false);
			expect(result.message).toBe('Post deletion failed!');
		});

		it('should delete post successfully', async () => {
			jest.spyOn(Post.prototype, 'isAuthor').mockReturnValue(true);

			jest.spyOn(cloudinaryService, 'handleDelete').mockResolvedValue(true);

			jest.spyOn(postRepository, 'delete').mockImplementation(async () => {
				return true;
			});

			const result = await postService.deletePost('MockId', 'MockId1');

			expect(result.message).toBe('Post deleted!');
			expect(result.success).toBe(true);
		});
	});
});
