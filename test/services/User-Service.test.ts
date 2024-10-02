import { Schema } from 'mongoose';
import { UserListDto } from '../../src/models/dtos/user/user-list-dto';
import { User } from '../../src/models/entities/User';
import { UserRepository } from '../../src/repositories/user-repository';
import { UserService } from '../../src/services/userService';
import { UserDoc } from '../../src/models/schemas/user.schema';
import { CloudinaryService } from '../../src/services/cloudinaryService';

describe('User Service', () => {
	let userRepository: UserRepository;
	let userService: UserService;
	let cloudinaryService: CloudinaryService;

	beforeEach(() => {
		userRepository = new UserRepository();
		cloudinaryService = new CloudinaryService();
		userService = new UserService(userRepository, cloudinaryService);

		// Mock User model
		jest.spyOn(userRepository, 'getByEmail').mockResolvedValue(
			new User({
				_id: 'mockedId',
				firstName: 'John',
				lastName: 'Doe',
				birthDate: new Date(),
				email: 'john.doe@example.com',
				password: 'password123',
				university: 'Mocked University',
				department: 'Mocked Department',
				studentEmail: 'john.doe@student.example.com',
				status: { studentVerification: false, emailVerification: false },
				profilePhotoUrl: 'mockedProfilePhotoUrl',
				friends: [],
				friendRequests: [],
				posts: [],
				organizations: [],
				attendances: [],
				createdAt: new Date(),
			})
		);

		jest.spyOn(userRepository, 'getById').mockResolvedValue(
			new User({
				_id: 'mockedId',
				firstName: 'John',
				lastName: 'Doe',
				birthDate: new Date(),
				email: 'john.doe@example.com',
				password: 'password123',
				university: 'Mocked University',
				department: 'Mocked Department',
				studentEmail: 'john.doe@student.example.com',
				status: { studentVerification: false, emailVerification: false },
				profilePhotoUrl: 'mockedProfilePhotoUrl',
				friends: [],
				friendRequests: [],
				posts: [],
				organizations: [],
				attendances: [],
				createdAt: new Date(),
			})
		);
	});

	describe('Get All Users', () => {
		it('should return all users', async () => {
			jest.spyOn(userRepository, 'getAll').mockResolvedValue([
				{
					firstName: 'John',
					lastName: 'Doe',
					birthDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 20),
					email: 'john.doe@example.com',
					password: 'password123',
					university: 'Mocked University',
					department: 'Mocked Department',
					studentEmail: 'john.doe@student.example.com',
					status: { studentVerification: false, emailVerification: false },
					profilePhotoUrl: 'mockedProfilePhotoUrl',
					friends: [],
					friendRequests: [],
					posts: [],
					createdAt: new Date(),
				} as UserListDto,
			]);
			const users = await userService.getAllUsers();
			expect(users.data).toHaveLength(1);
		});

		it('should return empty array', async () => {
			jest.spyOn(userRepository, 'getAll').mockResolvedValue([]);
			const users = await userService.getAllUsers();
			expect(users.data).toHaveLength(0);
		});
	});

	describe('Get User By Id', () => {
		it('should return user', async () => {
			const user = await userService.getUserById('mockedId');

			expect(user.data).toBeDefined();
			expect(user.message).toBe('User fetched successfully');
			expect(user.success).toBe(true);
		});

		it('should return user not found error', async () => {
			jest.spyOn(userRepository, 'getById').mockResolvedValue(null);

			const user = await userService.getUserById('mockedId');

			expect(user.message).toBe('User not found!');
			expect(user.success).toBe(false);
		});
	});

	describe('Search Users by Name', () => {
		it('should return users', async () => {
			jest.spyOn(userRepository, 'searchByName').mockResolvedValue([
				new User({
					_id: new Schema.Types.ObjectId('mockedId'),
					firstName: 'John',
					lastName: 'Doe',
					email: 'john.doe@example.com',
					university: 'Mocked University',
					department: 'Mocked Department',
					profilePhotoUrl: 'mockedProfilePhotoUrl',
					friends: [],
					createdAt: new Date(),
					birthDate: new Date(),
					friendRequests: [],
					password: 'password',
					studentEmail: 'john.doe@student.com',
					status: { studentVerification: false, emailVerification: false },
					attendances: [],
					organizations: [],
					posts: [],
				}),
			]);

			const result = await userService.searchByName('John', 'userId');

			expect(result.data).toHaveLength(1);
			expect(result.message).toBe('Users fetched successfully');
			expect(result.success).toBe(true);
		});

		it('should return empty array', async () => {
			jest.spyOn(userRepository, 'searchByName').mockResolvedValue([]);

			const result = await userService.searchByName('John', 'userId');

			expect(result.data).toHaveLength(0);
			expect(result.success).toBe(true);
		});

		it('should return error if userId does not exist', async () => {
			jest.spyOn(userRepository, 'searchByName').mockResolvedValue([]);

			jest.spyOn(userRepository, 'getById').mockResolvedValue(null);

			const result = await userService.searchByName('John', 'userId');

			expect(result.message).toBe('You must be logged in!');
			expect(result.success).toBe(false);
		});
	});

	describe('Change Profile Photo', () => {
		it('should change photo if already exists', async () => {
			jest.spyOn(userRepository, 'updateprofilePhoto').mockResolvedValue({
				_id: 'mockedId',
				firstName: 'John',
				lastName: 'Doe',
				birthDate: new Date(),
				email: 'mockedEmail',
				password: 'password123',
				university: 'Mocked University',
				department: 'Mocked Department',
				studentEmail: 'mockedStudentEmail',
				status: { studentVerification: false, emailVerification: false },
				profilePhotoUrl: 'mockedProfilePhotoUrl',
				friends: [],
				friendRequests: [],
				posts: [],
				organizations: [],
				attendances: [],
				createdAt: new Date(),
			} as UserDoc);

			jest.spyOn(cloudinaryService, 'handleDelete').mockResolvedValue(true);
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

			expect(result.message).toBe('Profile photo updated!');
			expect(result.success).toBe(true);
		});

		it('should add photo if not exists', async () => {
			jest.spyOn(userRepository, 'getById').mockResolvedValue(
				new User({
					_id: 'mockedId',
					firstName: 'John',
					lastName: 'Doe',
					birthDate: new Date(),
					email: 'john.doe@example.com',
					password: 'password123',
					university: 'Mocked University',
					department: 'Mocked Department',
					studentEmail: 'john.doe@student.example.com',
					status: { studentVerification: false, emailVerification: false },
					profilePhotoUrl: null,
					friends: [],
					friendRequests: [],
					posts: [],
					organizations: [],
					attendances: [],
					createdAt: new Date(),
				})
			);

			jest.spyOn(userRepository, 'updateprofilePhoto').mockResolvedValue({
				_id: 'mockedId',
				firstName: 'John',
				lastName: 'Doe',
				birthDate: new Date(),
				email: 'mockedEmail',
				password: 'password123',
				university: 'Mocked University',
				department: 'Mocked Department',
				studentEmail: 'mockedStudentEmail',
				status: { studentVerification: false, emailVerification: false },
				profilePhotoUrl: 'mockedProfilePhotoUrl',
				friends: [],
				friendRequests: [],
				posts: [],
				organizations: [],
				attendances: [],
				createdAt: new Date(),
			} as UserDoc);

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
			jest.spyOn(userRepository, 'getById').mockResolvedValue(null);

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

	// describe('Send Friend Request', () => {
	// 	it('should return error message when sending request to self', async () => {
	// 		const result = await userService.sendFriendRequest('mockedId', 'mockedId');

	// 		expect(result.message).toBe('You cannot be Friend of yourself!');
	// 		expect(result.success).toBe(false);
	// 	});

	// 	it('should return error message when user not found', async () => {
	// 		jest.spyOn(userRepository, 'getById').mockImplementationOnce(() => null);

	// 		const result = await userService.sendFriendRequest('mockedId', 'mockedId2');

	// 		expect(result.message).toBe('You must be logged in!');
	// 		expect(result.success).toBe(false);
	// 	});

	// 	it('should return error message when user to friend not found', async () => {
	// 		jest.spyOn(userRepository, 'getById').mockImplementationOnce(async () => {
	// 			return new User({
	// 				_id: 'mockedId',
	// 				firstName: 'John',
	// 				lastName: 'Doe',
	// 				birthDate: new Date(),
	// 				email: 'john.doe@example.com',
	// 				password: 'password123',
	// 				university: 'Mocked University',
	// 				department: 'Mocked Department',
	// 				studentEmail: 'john.doe@student.example.com',
	// 				status: { studentVerification: false, emailVerification: false },
	// 				profilePhotoUrl: 'mockedProfilePhotoUrl',
	// 				friends: [],
	// 				friendRequests: [],
	// 				posts: [],
	// 				organizations: [],
	// 				attendances: [],
	// 				createdAt: new Date(),
	// 			});
	// 		});

	// 		jest.spyOn(userRepository, 'getById').mockImplementationOnce(() => null);

	// 		const result = await userService.sendFriendRequest('mockedId', 'mockedId2');

	// 		expect(result.message).toBe('User to Friend not found!');
	// 		expect(result.success).toBe(false);
	// 	});

	// 	it('should return error message when already friend', async () => {
	// 		jest.spyOn(userRepository, 'getById').mockImplementationOnce(async () => {
	// 			return new User({
	// 				_id: 'mockedId',
	// 				firstName: 'John',
	// 				lastName: 'Doe',
	// 				birthDate: new Date(),
	// 				email: 'john.doe@example.com',
	// 				password: 'password123',
	// 				university: 'Mocked University',
	// 				department: 'Mocked Department',
	// 				studentEmail: 'john.doe@student.example.com',
	// 				status: { studentVerification: false, emailVerification: false },
	// 				profilePhotoUrl: 'mockedProfilePhotoUrl',
	// 				friends: ['mockedId2'],
	// 				friendRequests: [],
	// 				posts: [],
	// 				organizations: [],
	// 				attendances: [],
	// 				createdAt: new Date(),
	// 			});
	// 		});

	// 		jest.spyOn(userRepository, 'getById').mockImplementationOnce(async () => {
	// 			return new User({
	// 				_id: 'mockedId2',
	// 				firstName: 'Jane',
	// 				lastName: 'Doe',
	// 				birthDate: new Date(),
	// 				email: 'jane.doe@example.com',
	// 				password: 'password123',
	// 				university: 'Mocked University',
	// 				department: 'Mocked Department',
	// 				studentEmail: 'jane.doe@student.example.com',
	// 				status: { studentVerification: false, emailVerification: false },
	// 				profilePhotoUrl: 'mockedProfilePhotoUrl',
	// 				friends: ['mockedId'],
	// 				friendRequests: [],
	// 				posts: [],
	// 				organizations: [],
	// 				attendances: [],
	// 				createdAt: new Date(),
	// 			});
	// 		});

	// 		const result = await userService.sendFriendRequest('mockedId', 'mockedId2');

	// 		expect(result.message).toBe('You are already friends!');
	// 		expect(result.success).toBe(false);
	// 	});

	// 	it('should cancel the request when already requested', async () => {
	// 		jest.spyOn(userRepository, 'getById').mockImplementationOnce(async () => {
	// 			return new User({
	// 				_id: 'mockedId2',
	// 				firstName: 'Jane',
	// 				lastName: 'Doe',
	// 				birthDate: new Date(),
	// 				email: 'jane.doe@example.com',
	// 				password: 'password123',
	// 				university: 'Mocked University',
	// 				department: 'Mocked Department',
	// 				studentEmail: 'jane.doe@student.example.com',
	// 				status: { studentVerification: false, emailVerification: false },
	// 				profilePhotoUrl: 'mockedProfilePhotoUrl',
	// 				friends: [],
	// 				friendRequests: [],
	// 				posts: [],
	// 				organizations: [],
	// 				attendances: [],
	// 				createdAt: new Date(),
	// 			});
	// 		});

	// 		jest.spyOn(userRepository, 'getById').mockImplementationOnce(async () => {
	// 			return new User({
	// 				_id: 'mockedId',
	// 				firstName: 'John',
	// 				lastName: 'Doe',
	// 				birthDate: new Date(),
	// 				email: 'john.doe@example.com',
	// 				password: 'password123',
	// 				university: 'Mocked University',
	// 				department: 'Mocked Department',
	// 				studentEmail: 'john.doe@student.example.com',
	// 				status: { studentVerification: false, emailVerification: false },
	// 				profilePhotoUrl: 'mockedProfilePhotoUrl',
	// 				friends: [],
	// 				friendRequests: ['mockedId2'],
	// 				posts: [],
	// 				organizations: [],
	// 				attendances: [],
	// 				createdAt: new Date(),
	// 			});
	// 		});

	// 		jest.spyOn(userRepository, 'deleteFriendRequest').mockResolvedValue({
	// 			_id: 'mockedId',
	// 			firstName: 'John',
	// 			lastName: 'Doe',
	// 			birthDate: new Date(),
	// 			email: 'mockedEmail',
	// 			password: 'password123',
	// 			university: 'Mocked University',
	// 			department: 'Mocked Department',
	// 			studentEmail: 'mockedStudentEmail',
	// 			status: { studentVerification: false, emailVerification: false },
	// 			profilePhotoUrl: 'mockedProfilePhotoUrl',
	// 			friends: [],
	// 			friendRequests: [],
	// 			posts: [],
	// 			organizations: [],
	// 			attendances: [],
	// 			createdAt: new Date(),
	// 		} as UserDoc);

	// 		const result = await userService.sendFriendRequest('mockedId', 'mockedId2');

	// 		expect(result.message).toBe('Friend request cancelled!');
	// 		expect(result.success).toBe(true);
	// 	});

	// 	it('should send friend request when they are not friend and not requested to be friend', async () => {
	// 		jest.spyOn(userRepository, 'getById').mockImplementationOnce(async () => {
	// 			return new User({
	// 				_id: 'mockedId',
	// 				firstName: 'John',
	// 				lastName: 'Doe',
	// 				birthDate: new Date(),
	// 				email: 'john.doe@example.com',
	// 				password: 'password123',
	// 				university: 'Mocked University',
	// 				department: 'Mocked Department',
	// 				studentEmail: 'john.doe@student.example.com',
	// 				status: { studentVerification: false, emailVerification: false },
	// 				profilePhotoUrl: 'mockedProfilePhotoUrl',
	// 				friends: [],
	// 				friendRequests: ['mockedId2'],
	// 				posts: [],
	// 				organizations: [],
	// 				attendances: [],
	// 				createdAt: new Date(),
	// 			});
	// 		});

	// 		jest.spyOn(userRepository, 'getById').mockImplementationOnce(async () => {
	// 			return new User({
	// 				_id: 'mockedId2',
	// 				firstName: 'Jane',
	// 				lastName: 'Doe',
	// 				birthDate: new Date(),
	// 				email: 'jane.doe@example.com',
	// 				password: 'password123',
	// 				university: 'Mocked University',
	// 				department: 'Mocked Department',
	// 				studentEmail: 'jane.doe@student.example.com',
	// 				status: { studentVerification: false, emailVerification: false },
	// 				profilePhotoUrl: 'mockedProfilePhotoUrl',
	// 				friends: [],
	// 				friendRequests: [],
	// 				posts: [],
	// 				organizations: [],
	// 				attendances: [],
	// 				createdAt: new Date(),
	// 			});
	// 		});

	// 		jest.spyOn(userRepository, 'sendFriendRequest').mockResolvedValue({
	// 			_id: 'mockedId',
	// 			firstName: 'John',
	// 			lastName: 'Doe',
	// 			birthDate: new Date(),
	// 			email: 'mockedEmail',
	// 			password: 'password123',
	// 			university: 'Mocked University',
	// 			department: 'Mocked Department',
	// 			studentEmail: 'mockedStudentEmail',
	// 			status: { studentVerification: false, emailVerification: false },
	// 			profilePhotoUrl: 'mockedProfilePhotoUrl',
	// 			friends: [],
	// 			friendRequests: [],
	// 			posts: [],
	// 			organizations: [],
	// 			attendances: [],
	// 			createdAt: new Date(),
	// 		} as UserDoc);

	// 		const result = await userService.sendFriendRequest('mockedId', 'mockedId2');

	// 		expect(result.message).toBe('Friend request sent!');
	// 		expect(result.success).toBe(true);
	// 	});
	// });

	// describe('Handle Friend Request', () => {
	// 	it('should return error message when user not found', async () => {
	// 		jest.spyOn(userRepository, 'getById').mockResolvedValue(null);

	// 		const result = await userService.handleFriendRequest('mockedId', 'mockedId2', true);

	// 		expect(result.message).toBe('You must be logged in!');
	// 		expect(result.success).toBe(false);
	// 	});

	// 	it('should return error message when user to friend not found', async () => {
	// 		jest.spyOn(userRepository, 'getById').mockImplementationOnce(async () => {
	// 			return new User({
	// 				_id: 'mockedId',
	// 				firstName: 'John',
	// 				lastName: 'Doe',
	// 				birthDate: new Date(),
	// 				email: 'john.doe@example.com',
	// 				password: 'password123',
	// 				university: 'Mocked University',
	// 				department: 'Mocked Department',
	// 				studentEmail: 'john.doe@student.example.com',
	// 				status: { studentVerification: false, emailVerification: false },
	// 				profilePhotoUrl: 'mockedProfilePhotoUrl',
	// 				friends: [],
	// 				friendRequests: ['mockedId2'],
	// 				posts: [],
	// 				organizations: [],
	// 				attendances: [],
	// 				createdAt: new Date(),
	// 			});
	// 		});

	// 		jest.spyOn(userRepository, 'getById').mockImplementationOnce(async () => {
	// 			return null;
	// 		});

	// 		const result = await userService.handleFriendRequest('mockedId', 'mockedId2', true);

	// 		expect(result.message).toBe('User not found!');
	// 		expect(result.success).toBe(false);
	// 	});

	// 	it('should return error message when already friend', async () => {
	// 		jest.spyOn(userRepository, 'getById').mockImplementationOnce(async () => {
	// 			return new User({
	// 				_id: 'mockedId',
	// 				firstName: 'John',
	// 				lastName: 'Doe',
	// 				birthDate: new Date(),
	// 				email: 'john.doe@example.com',
	// 				password: 'password123',
	// 				university: 'Mocked University',
	// 				department: 'Mocked Department',
	// 				studentEmail: 'john.doe@student.example.com',
	// 				status: { studentVerification: false, emailVerification: false },
	// 				profilePhotoUrl: 'mockedProfilePhotoUrl',
	// 				friends: ['mockedId2'],
	// 				friendRequests: [],
	// 				posts: [],
	// 				organizations: [],
	// 				attendances: [],
	// 				createdAt: new Date(),
	// 			});
	// 		});

	// 		jest.spyOn(userRepository, 'getById').mockImplementationOnce(async () => {
	// 			return new User({
	// 				_id: 'mockedId2',
	// 				firstName: 'Jane',
	// 				lastName: 'Doe',
	// 				birthDate: new Date(),
	// 				email: 'jane.doe@example.com',
	// 				password: 'password123',
	// 				university: 'Mocked University',
	// 				department: 'Mocked Department',
	// 				studentEmail: 'jane.doe@student.example.com',
	// 				status: { studentVerification: false, emailVerification: false },
	// 				profilePhotoUrl: 'mockedProfilePhotoUrl',
	// 				friends: ['mockedId'],
	// 				friendRequests: [],
	// 				posts: [],
	// 				organizations: [],
	// 				attendances: [],
	// 				createdAt: new Date(),
	// 			});
	// 		});

	// 		const result = await userService.handleFriendRequest('mockedId', 'mockedId2', true);

	// 		expect(result.message).toBe('You are already friends!');
	// 		expect(result.success).toBe(false);
	// 	});

	// 	it('should return error message when not requested to be friend', async () => {
	// 		jest.spyOn(userRepository, 'getById').mockImplementationOnce(async () => {
	// 			return new User({
	// 				_id: 'mockedId',
	// 				firstName: 'John',
	// 				lastName: 'Doe',
	// 				birthDate: new Date(),
	// 				email: 'john.doe@example.com',
	// 				password: 'password123',
	// 				university: 'Mocked University',
	// 				department: 'Mocked Department',
	// 				studentEmail: 'john.doe@student.example.com',
	// 				status: { studentVerification: false, emailVerification: false },
	// 				profilePhotoUrl: 'mockedProfilePhotoUrl',
	// 				friends: [],
	// 				friendRequests: [],
	// 				posts: [],
	// 				organizations: [],
	// 				attendances: [],
	// 				createdAt: new Date(),
	// 			});
	// 		});

	// 		jest.spyOn(userRepository, 'getById').mockImplementationOnce(async () => {
	// 			return new User({
	// 				_id: 'mockedId2',
	// 				firstName: 'Jane',
	// 				lastName: 'Doe',
	// 				birthDate: new Date(),
	// 				email: 'jane.doe@example.com',
	// 				password: 'password123',
	// 				university: 'Mocked University',
	// 				department: 'Mocked Department',
	// 				studentEmail: 'jane.doe@student.example.com',
	// 				status: { studentVerification: false, emailVerification: false },
	// 				profilePhotoUrl: 'mockedProfilePhotoUrl',
	// 				friends: [],
	// 				friendRequests: [],
	// 				posts: [],
	// 				organizations: [],
	// 				attendances: [],
	// 				createdAt: new Date(),
	// 			});
	// 		});

	// 		const result = await userService.handleFriendRequest('mockedId', 'mockedId2', true);

	// 		expect(result.message).toBe('No follow request found!');
	// 		expect(result.success).toBe(false);
	// 	});

	// 	it('should accept the request when requested to be friend', async () => {
	// 		jest.spyOn(userRepository, 'getById').mockImplementationOnce(async () => {
	// 			return new User({
	// 				_id: 'mockedId',
	// 				firstName: 'John',
	// 				lastName: 'Doe',
	// 				birthDate: new Date(),
	// 				email: 'john.doe@example.com',
	// 				password: 'password123',
	// 				university: 'Mocked University',
	// 				department: 'Mocked Department',
	// 				studentEmail: 'john.doe@student.example.com',
	// 				status: { studentVerification: false, emailVerification: false },
	// 				profilePhotoUrl: 'mockedProfilePhotoUrl',
	// 				friends: [],
	// 				friendRequests: ['mockedId2'],
	// 				posts: [],
	// 				organizations: [],
	// 				attendances: [],
	// 				createdAt: new Date(),
	// 			});
	// 		});

	// 		jest.spyOn(userRepository, 'getById').mockImplementationOnce(async () => {
	// 			return new User({
	// 				_id: 'mockedId2',
	// 				firstName: 'Jane',
	// 				lastName: 'Doe',
	// 				birthDate: new Date(),
	// 				email: 'jane.doe@example.com',
	// 				password: 'password123',
	// 				university: 'Mocked University',
	// 				department: 'Mocked Department',
	// 				studentEmail: 'jane.doe@student.example.com',
	// 				status: { studentVerification: false, emailVerification: false },
	// 				profilePhotoUrl: 'mockedProfilePhotoUrl',
	// 				friends: [],
	// 				friendRequests: [],
	// 				posts: [],
	// 				organizations: [],
	// 				attendances: [],
	// 				createdAt: new Date(),
	// 			});
	// 		});

	// 		jest.spyOn(userRepository, 'acceptFriendRequest').mockResolvedValue({
	// 			_id: 'mockedId',
	// 			firstName: 'John',
	// 			lastName: 'Doe',
	// 			birthDate: new Date(),
	// 			email: 'john.doe@example.com',
	// 			password: 'password123',
	// 			university: 'Mocked University',
	// 			department: 'Mocked Department',
	// 			studentEmail: 'john.doe@student.example.com',
	// 			status: { studentVerification: false, emailVerification: false },
	// 			profilePhotoUrl: 'mockedProfilePhotoUrl',
	// 			friends: [new mongoose.Schema.Types.ObjectId('mockedId2')],
	// 			friendRequests: [],
	// 			createdAt: new Date(),
	// 		} as UserDoc);

	// 		const result = await userService.handleFriendRequest('mockedId', 'mockedId2', true);

	// 		expect(result.message).toBe('Friend request accepted!');
	// 		expect(result.success).toBe(true);
	// 	});

	// 	it('should reject the request when requested to be friend', async () => {
	// 		jest.spyOn(userRepository, 'getById').mockImplementationOnce(async () => {
	// 			return new User({
	// 				_id: 'mockedId',
	// 				firstName: 'John',
	// 				lastName: 'Doe',
	// 				birthDate: new Date(),
	// 				email: 'john.doe@example.com',
	// 				password: 'password123',
	// 				university: 'Mocked University',
	// 				department: 'Mocked Department',
	// 				studentEmail: 'john.doe@student.example.com',
	// 				status: { studentVerification: false, emailVerification: false },
	// 				profilePhotoUrl: 'mockedProfilePhotoUrl',
	// 				friends: [],
	// 				friendRequests: ['mockedId2'],
	// 				posts: [],
	// 				organizations: [],
	// 				attendances: [],
	// 				createdAt: new Date(),
	// 			});
	// 		});

	// 		jest.spyOn(userRepository, 'getById').mockImplementationOnce(async () => {
	// 			return new User({
	// 				_id: 'mockedId2',
	// 				firstName: 'Jane',
	// 				lastName: 'Doe',
	// 				birthDate: new Date(),
	// 				email: 'jane.doe@example.com',
	// 				password: 'password123',
	// 				university: 'Mocked University',
	// 				department: 'Mocked Department',
	// 				studentEmail: 'jane.doe@student.example.com',
	// 				status: { studentVerification: false, emailVerification: false },
	// 				profilePhotoUrl: 'mockedProfilePhotoUrl',
	// 				friends: [],
	// 				friendRequests: [],
	// 				posts: [],
	// 				organizations: [],
	// 				attendances: [],
	// 				createdAt: new Date(),
	// 			});
	// 		});

	// 		jest.spyOn(userRepository, 'rejectFriendRequest').mockResolvedValue({
	// 			_id: 'mockedId',
	// 			firstName: 'John',
	// 			lastName: 'Doe',
	// 			birthDate: new Date(),
	// 			email: 'john.doe@example.com',
	// 			password: 'password123',
	// 			university: 'Mocked University',
	// 			department: 'Mocked Department',
	// 			studentEmail: 'john.doe@student.example.com',
	// 			status: { studentVerification: false, emailVerification: false },
	// 			profilePhotoUrl: 'mockedProfilePhotoUrl',
	// 			friends: [],
	// 			friendRequests: [],
	// 			createdAt: new Date(),
	// 		} as UserDoc);

	// 		const result = await userService.handleFriendRequest('mockedId', 'mockedId2', false);

	// 		expect(result.message).toBe('Friend request rejected!');
	// 		expect(result.success).toBe(true);
	// 	});
	// });

	// describe('Unfriend', () => {
	// 	it('should return error message when one of the users not found', async () => {
	// 		jest.spyOn(userRepository, 'getById').mockImplementationOnce(async () => {
	// 			return new User({
	// 				_id: 'mockedId',
	// 				firstName: 'John',
	// 				lastName: 'Doe',
	// 				birthDate: new Date(),
	// 				email: 'john.doe@example.com',
	// 				password: 'password123',
	// 				university: 'Mocked University',
	// 				department: 'Mocked Department',
	// 				studentEmail: 'john.doe@student.example.com',
	// 				status: { studentVerification: false, emailVerification: false },
	// 				profilePhotoUrl: 'mockedProfilePhotoUrl',
	// 				friends: [],
	// 				friendRequests: ['mockedId2'],
	// 				posts: [],
	// 				organizations: [],
	// 				attendances: [],
	// 				createdAt: new Date(),
	// 			});
	// 		});

	// 		jest.spyOn(userRepository, 'getById').mockResolvedValue(null);

	// 		const result = await userService.unfriend('mockedId', 'mockedId2');

	// 		expect(result.message).toBe('User not found!');
	// 		expect(result.success).toBe(false);
	// 	});

	// 	it('should return error message when users are not friend', async () => {
	// 		jest.spyOn(userRepository, 'getById').mockImplementationOnce(async () => {
	// 			return new User({
	// 				_id: 'mockedId',
	// 				firstName: 'John',
	// 				lastName: 'Doe',
	// 				birthDate: new Date(),
	// 				email: 'john.doe@example.com',
	// 				password: 'password123',
	// 				university: 'Mocked University',
	// 				department: 'Mocked Department',
	// 				studentEmail: 'john.doe@student.example.com',
	// 				status: { studentVerification: false, emailVerification: false },
	// 				profilePhotoUrl: 'mockedProfilePhotoUrl',
	// 				friends: [],
	// 				friendRequests: [],
	// 				posts: [],
	// 				organizations: [],
	// 				attendances: [],
	// 				createdAt: new Date(),
	// 			});
	// 		});

	// 		jest.spyOn(userRepository, 'getById').mockImplementationOnce(async () => {
	// 			return new User({
	// 				_id: 'mockedId2',
	// 				firstName: 'Jane',
	// 				lastName: 'Doe',
	// 				birthDate: new Date(),
	// 				email: 'jane.doe@example.com',
	// 				password: 'password123',
	// 				university: 'Mocked University',
	// 				department: 'Mocked Department',
	// 				studentEmail: 'jane.doe@student.example.com',
	// 				status: { studentVerification: false, emailVerification: false },
	// 				profilePhotoUrl: 'mockedProfilePhotoUrl',
	// 				friends: [],
	// 				friendRequests: [],
	// 				posts: [],
	// 				organizations: [],
	// 				attendances: [],
	// 				createdAt: new Date(),
	// 			});
	// 		});

	// 		const result = await userService.unfriend('mockedId', 'mockedId2');

	// 		expect(result.message).toBe('You are not friends!');
	// 		expect(result.success).toBe(false);
	// 	});

	// 	it('should unfriend the users with valid inputs', async () => {
	// 		jest.spyOn(userRepository, 'getById').mockImplementationOnce(async () => {
	// 			return new User({
	// 				_id: 'mockedId',
	// 				firstName: 'John',
	// 				lastName: 'Doe',
	// 				birthDate: new Date(),
	// 				email: 'john.doe@example.com',
	// 				password: 'password123',
	// 				university: 'Mocked University',
	// 				department: 'Mocked Department',
	// 				studentEmail: 'john.doe@student.example.com',
	// 				status: { studentVerification: false, emailVerification: false },
	// 				profilePhotoUrl: 'mockedProfilePhotoUrl',
	// 				friends: ['mockedId2'],
	// 				friendRequests: [],
	// 				posts: [],
	// 				organizations: [],
	// 				attendances: [],
	// 				createdAt: new Date(),
	// 			});
	// 		});

	// 		jest.spyOn(userRepository, 'getById').mockImplementationOnce(async () => {
	// 			return new User({
	// 				_id: 'mockedId2',
	// 				firstName: 'Jane',
	// 				lastName: 'Doe',
	// 				birthDate: new Date(),
	// 				email: 'jane.doe@example.com',
	// 				password: 'password123',
	// 				university: 'Mocked University',
	// 				department: 'Mocked Department',
	// 				studentEmail: 'jane.doe@student.example.com',
	// 				status: { studentVerification: false, emailVerification: false },
	// 				profilePhotoUrl: 'mockedProfilePhotoUrl',
	// 				friends: ['mockedId'],
	// 				friendRequests: [],
	// 				posts: [],
	// 				organizations: [],
	// 				attendances: [],
	// 				createdAt: new Date(),
	// 			});
	// 		});

	// 		jest.spyOn(userRepository, 'removeFriend').mockResolvedValue({
	// 			_id: 'mockedId',
	// 			firstName: 'John',
	// 			lastName: 'Doe',
	// 			birthDate: new Date(),
	// 			email: 'john.doe@example.com',
	// 			password: 'password123',
	// 			university: 'Mocked University',
	// 			department: 'Mocked Department',
	// 			studentEmail: 'john.doe@student.example.com',
	// 			status: { studentVerification: false, emailVerification: false },
	// 			profilePhotoUrl: 'mockedProfilePhotoUrl',
	// 			friends: [],
	// 			friendRequests: [],
	// 			createdAt: new Date(),
	// 		} as UserDoc);

	// 		const result = await userService.unfriend('mockedId', 'mockedId2');

	// 		expect(result.message).toBe('User unfriended!');
	// 		expect(result.success).toBe(true);
	// 	});
	// });

	describe('Delete Profile Photo', () => {
		it('should return error message when user not found', async () => {
			jest.spyOn(userRepository, 'getById').mockResolvedValue(null);

			const result = await userService.deleteProfilePhoto('mockedId');

			expect(result.message).toBe('User not found!');
			expect(result.success).toBe(false);
		});

		it('should return error message when user has no profile photo', async () => {
			jest.spyOn(userRepository, 'getById').mockImplementationOnce(async () => {
				return new User({
					_id: 'mockedId',
					firstName: 'John',
					lastName: 'Doe',
					birthDate: new Date(),
					email: 'john.doe@example.com',
					password: 'password123',
					university: 'Mocked University',
					department: 'Mocked Department',
					studentEmail: 'john.doe@student.example.com',
					status: { studentVerification: false, emailVerification: false },
					profilePhotoUrl: null,
					friends: ['mockedId2'],
					friendRequests: [],
					posts: [],
					organizations: [],
					attendances: [],
					createdAt: new Date(),
				});
			});

			const result = await userService.deleteProfilePhoto('mockedId');

			expect(result.message).toBe('You have not uploaded profile photo yet!');
			expect(result.success).toBe(false);
		});

		it('should return error message when profile photo could not be deleted', async () => {
			jest.spyOn(userRepository, 'getById').mockImplementationOnce(async () => {
				return new User({
					_id: 'mockedId',
					firstName: 'John',
					lastName: 'Doe',
					birthDate: new Date(),
					email: 'john.doe@example.com',
					password: 'password123',
					university: 'Mocked University',
					department: 'Mocked Department',
					studentEmail: 'john.doe@student.example.com',
					status: { studentVerification: false, emailVerification: false },
					profilePhotoUrl: 'mockedProfilePhotoUrl',
					friends: ['mockedId2'],
					friendRequests: [],
					posts: [],
					organizations: [],
					attendances: [],
					createdAt: new Date(),
				});
			});

			jest.spyOn(cloudinaryService, 'handleDelete').mockResolvedValue(false);

			const result = await userService.deleteProfilePhoto('mockedId');

			expect(result.message).toBe('Profile photo deletion error!');
			expect(result.success).toBe(false);
		});

		it('should delete profile photo successfully with valid inputs', async () => {
			jest.spyOn(userRepository, 'getById').mockImplementationOnce(async () => {
				return new User({
					_id: 'mockedId',
					firstName: 'John',
					lastName: 'Doe',
					birthDate: new Date(),
					email: 'john.doe@example.com',
					password: 'password123',
					university: 'Mocked University',
					department: 'Mocked Department',
					studentEmail: 'john.doe@student.example.com',
					status: { studentVerification: false, emailVerification: false },
					profilePhotoUrl: 'mockedProfilePhotoUrl',
					friends: ['mockedId2'],
					friendRequests: [],
					posts: [],
					organizations: [],
					attendances: [],
					createdAt: new Date(),
				});
			});

			jest.spyOn(cloudinaryService, 'handleDelete').mockResolvedValue(true);
			jest.spyOn(userRepository, 'deleteProfilePhoto').mockResolvedValue({
				_id: 'mockedId',
				firstName: 'John',
				lastName: 'Doe',
				birthDate: new Date(),
				email: 'john.doe@example.com',
				password: 'password123',
				university: 'Mocked University',
				department: 'Mocked Department',
				studentEmail: 'john.doe@student.example.com',
				status: { studentVerification: false, emailVerification: false },
				profilePhotoUrl: null,
				friends: [],
				friendRequests: [],
				createdAt: new Date(),
			} as UserDoc);

			const result = await userService.deleteProfilePhoto('mockedId');

			expect(result.message).toBe('Profile photo deleted!');
			expect(result.success).toBe(true);
		});
	});
});
