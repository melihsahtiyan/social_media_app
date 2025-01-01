import { User } from '../../../src/models/entities/User';
import { UserRepository } from '../../../src/persistence/repositories/user-repository';
import { UserService } from '../../../src/application/services/user.service';
import { UserDoc } from '../../../src/models/schemas/user.schema';
import { CloudinaryService } from '../../../src/application/services/cloudinary.service';
import { userMocks } from './user.mocks';

describe('User Service', () => {
	let userRepository: UserRepository;
	let userService: UserService;
	let cloudinaryService: CloudinaryService;

	beforeAll(() => {
		userRepository = new UserRepository();
		cloudinaryService = new CloudinaryService();
		userService = new UserService(userRepository, cloudinaryService);
	});

	beforeEach(() => {
		jest.spyOn(userRepository, 'get').mockResolvedValue(userMocks.initialUserMocks[0]);

		// Mock User model
		jest.spyOn(userRepository, 'getByEmail').mockResolvedValue(userMocks.initialUserMocks[0]);
	});

	describe('Get All Users', () => {
		it('should return all users', async () => {
			jest.spyOn(userRepository, 'getAll').mockResolvedValue(userMocks.initialUserMocks as UserDoc[]);
			const users = await userService.getAllUsers();

			expect(users.data).toHaveLength(2);
			expect(users.message).toBe('Users fetched successfully');
			expect(users.success).toBe(true);
		});

		it('should return empty array', async () => {
			jest.spyOn(userRepository, 'getAll').mockResolvedValue([]);
			const users = await userService.getAllUsers();

			expect(users.data).toHaveLength(0);
			expect(users.success).toBe(true);
		});
	});

	describe('Get User By Id', () => {
		it('should return user', async () => {
			jest.spyOn(userRepository, 'get').mockResolvedValueOnce(userMocks.initialUserMocks[0]);

			const response = await userService.getUserById('mockedId');

			expect(response.message).toBe('User fetched successfully');
			expect(response.success).toBe(true);
			expect(response.data).toBeInstanceOf(User);
		});

		it('should return user not found error', async () => {
			jest.spyOn(userRepository, 'get').mockResolvedValue(null);

			const response = await userService.getUserById('mockedId');

			expect(response.message).toBe('User not found!');
			expect(response.success).toBe(false);
		});
	});

	describe('Search Users by Name', () => {
		it('should return users', async () => {
			jest.spyOn(userRepository, 'searchByName').mockResolvedValue([userMocks.initialUserMocks[1]]);

			jest.spyOn(userRepository, 'get').mockResolvedValue(userMocks.initialUserMocks[0]);

			const result = await userService.searchByName('John', 'userId');

			expect(result.data).toHaveLength(1);
			expect(result.message).toBe('Users fetched successfully');
			expect(result.success).toBe(true);
		});

		it('should return empty array', async () => {
			jest.spyOn(userRepository, 'searchByName').mockResolvedValue([]);

			jest.spyOn(userRepository, 'get').mockResolvedValue(userMocks.initialUserMocks[0]);

			const result = await userService.searchByName('John', 'userId');

			expect(result.data).toHaveLength(0);
			expect(result.success).toBe(true);
		});

		it('should return error if userId does not exist', async () => {
			jest.spyOn(userRepository, 'searchByName').mockResolvedValue([userMocks.initialUserMocks[0]]);

			jest.spyOn(userRepository, 'get').mockResolvedValue(null);

			const result = await userService.searchByName('John', 'userId');

			expect(result.message).toBe('You must be logged in!');
			expect(result.success).toBe(false);
		});
	});

	describe('Change Profile Photo', () => {
		it('should change photo if already exists', async () => {
			jest.spyOn(userRepository, 'get').mockResolvedValue(userMocks.initialUserMocks[0] as UserDoc);
			jest.spyOn(cloudinaryService, 'handleDelete').mockResolvedValue(true);
			jest.spyOn(cloudinaryService, 'handleUpload').mockResolvedValue('mockedProfilePhotoUrl');

			const file: Express.Multer.File = {
				fieldname: 'profilePhoto',
				originalname: 'mockedProfilePhotoUrl',
				encoding: '7bit',
				mimetype: 'image/jpeg',
				size: 1024,
				destination: 'uploads/',
				filename: 'mockedProfilePhotoUrl',
				buffer: Buffer.from('mockedProfilePhotoUrl', 'utf8'),
				path: 'uploads/mockedProfilePhotoUrl',
				stream: null,
			};

			const result = await userService.changeProfilePhoto('mockedId', file);

			expect(result.message).toBe('Profile photo updated!');
			expect(result.success).toBe(true);
		});

		it('should add photo if not exists', async () => {
			jest.spyOn(userRepository, 'get').mockResolvedValue(userMocks.initialUserMocks[1] as UserDoc);

			jest.spyOn(cloudinaryService, 'handleUpload').mockResolvedValue('mockedProfilePhotoUrl');

			const file: Express.Multer.File = {
				fieldname: 'profilePhoto',
				originalname: 'mockedProfilePhotoUrl',
				encoding: '7bit',
				mimetype: 'image/jpeg',
				size: 10000,
				destination: 'uploads/',
				filename: 'mockedProfilePhotoUrl',
				buffer: Buffer.from('mockedProfilePhotoUrl', 'utf8'),
				path: 'uploads/mockedProfilePhotoUrl',
				stream: null,
			};

			const result = await userService.changeProfilePhoto('mockedId', file);

			expect(result.message).toBe('Profile photo added!');
			expect(result.success).toBe(true);
		});

		it('should return error message when file does not included', async () => {
			jest.spyOn(userRepository, 'updateprofilePhoto').mockResolvedValue(null);

			const result = await userService.changeProfilePhoto('mockedId', null);

			expect(result.message).toBe('You have not uploaded profile photo!');
			expect(result.success).toBe(false);
		});

		it('should return error message when user not found', async () => {
			jest.spyOn(userRepository, 'get').mockResolvedValue(null);

			const file: Express.Multer.File = {
				fieldname: 'profilePhoto',
				originalname: 'mockedProfilePhotoUrl',
				encoding: '7bit',
				mimetype: 'image/jpeg',
				size: 10000,
				destination: 'uploads/',
				filename: 'mockedProfilePhotoUrl',
				buffer: Buffer.from('mockedProfilePhotoUrl', 'utf8'),
				path: 'uploads/mockedProfilePhotoUrl',
				stream: null,
			};

			const result = await userService.changeProfilePhoto('mockedId', file);

			expect(result.message).toBe('User not found!');
			expect(result.success).toBe(false);
		});
	});

	describe('Delete Profile Photo', () => {
		it('should return error message when user not found', async () => {
			jest.spyOn(userRepository, 'get').mockResolvedValue(null);

			const result = await userService.deleteProfilePhoto('mockedId');

			expect(result.message).toBe('User not found!');
			expect(result.success).toBe(false);
		});

		it('should return error message when user has no profile photo', async () => {
			jest.spyOn(userRepository, 'get').mockImplementationOnce(async () => {
				return userMocks.initialUserMocks[1];
			});

			const result = await userService.deleteProfilePhoto('mockedId');

			expect(result.message).toBe('You have not uploaded profile photo yet!');
			expect(result.success).toBe(false);
		});

		it('should return error message when profile photo could not be deleted', async () => {
			jest.spyOn(userRepository, 'get').mockResolvedValue(userMocks.initialUserMocks[0]);

			jest.spyOn(cloudinaryService, 'handleDelete').mockResolvedValue(false);

			const result = await userService.deleteProfilePhoto('mockedId');

			expect(result.message).toBe('Profile photo deletion error!');
			expect(result.success).toBe(false);
		});

		it('should delete profile photo successfully with valid inputs', async () => {
			jest.spyOn(userRepository, 'getById').mockImplementationOnce(async () => {
				return { ...userMocks.initialUserMocks[0], profilePhotoUrl: 'mockedProfilePhotoUrl' } as User;
			});

			jest.spyOn(cloudinaryService, 'handleDelete').mockResolvedValue(true);
			jest.spyOn(userRepository, 'deleteProfilePhoto').mockResolvedValue(userMocks.initialUserMocks[0] as UserDoc);

			const result = await userService.deleteProfilePhoto('mockedId');

			expect(result.message).toBe('Profile photo deleted!');
			expect(result.success).toBe(true);
		});
	});

	afterAll(() => {
		jest.clearAllMocks();
	});
});
