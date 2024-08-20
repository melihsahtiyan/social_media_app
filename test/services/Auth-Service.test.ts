import { User } from '../../src/models/entites/User';
import UserForLogin from '../../src/models/dtos/user/user-for-login';
import UserForRegister from '../../src/models/dtos/user/user-for-register';
import { UserRepository } from '../../src/repositories/user-repository';
import { AuthService } from '../../src/services/authService';

jest.mock('../../src/repositories/user-repository.ts', () => {
	return {
		UserRepository: jest.fn().mockImplementation(() => {
			return {
				getByEmail: jest.fn().mockReturnValue(
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
						createdAt: new Date()
					})
				)
			};
		})
	};
});

describe('Auth Service', () => {
	let userRepository: UserRepository;
	let authService: AuthService;

	beforeEach(() => {
		userRepository = new UserRepository();
		authService = new AuthService(userRepository);

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
				createdAt: new Date()
			})
		);

		// Mock comparePassword method
		jest.spyOn(User.prototype, 'comparePassword').mockResolvedValue(true);

		// Mock other User methods
		jest.spyOn(User.prototype, 'hasVerifiedEmail').mockReturnValue(true);
	});

	describe('register', () => {
		it('should register a new user with valid data', async () => {
			const userData: UserForRegister = {
				firstName: 'John',
				lastName: 'Doe',
				birthDate: new Date('01-31-2000'),
				email: 'john.doe@example.com',
				password: 'password123'
			};
			// Call the method under test
			const result = await authService.register(userData);

			// Assert the expected behavior
			expect(result).toBeTruthy();
			// Add more assertions as necessary
		});

		it('should return an error if the user is under 18 years old', async () => {
			const userData: UserForRegister = {
				firstName: 'John',
				lastName: 'Doe',
				birthDate: new Date('01-31-2010'),
				email: 'john.doe@example.com',
				password: 'password123'
			};

			// Call the method under test
			const result = await authService.register(userData);

			// Assert the expected behavior
			expect(result.message).toBe('You must be 18 years old');
			expect(result.success).toBe(false);
		});

		it('should return an error if the user already exists', async () => {
			const userData: UserForRegister = {
				firstName: 'John',
				lastName: 'Doe',
				birthDate: new Date('01-31-2000'),
				email: 'john.doe@example.com',
				password: 'password123'
			};

			// Call the method under test
			const result = await authService.register(userData);

			// Assert the expected behavior
			expect(result.message).toBe('User already exists');
			expect(result.success).toBe(false);
		});
	});

	describe('login', () => {
		const userData: UserForLogin = {
			email: 'john.doe@example.com',
			password: 'password123'
		};
		it('should login a user with valid credentials', async () => {
			// Call the method under test

			jest.spyOn(userRepository, 'getByEmail').mockResolvedValueOnce(
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
					status: { studentVerification: true, emailVerification: true },
					profilePhotoUrl: 'mockedProfilePhotoUrl',
					friends: [],
					friendRequests: [],
					posts: [],
					organizations: [],
					attendances: [],
					createdAt: new Date()
				})
			);

			jest.spyOn(User.prototype, 'generateJsonWebToken').mockReturnValue('mockedToken');

			const result = await authService.login(userData);

			// Assert the expected behavior
			expect(result.message).toBe('Login successful! Token generated');
			expect(result.success).toBe(true);
			expect(result.data.token).toBe('mockedToken');
		});

		it('should return an error if the user does not exist', async () => {
			jest.spyOn(userRepository, 'getByEmail').mockResolvedValue(null);
			// Call the method under test
			const result = await authService.login(userData);

			// Assert the expected behavior
			expect(result.message).toBe('Email or password is incorrect!');
		});

		it('should return an error if the password is incorrect', async () => {
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
					createdAt: new Date()
				})
			);

			// Mock comparePassword to return false
			jest.spyOn(User.prototype, 'comparePassword').mockResolvedValue(false);

			// Call the method under test
			const result = await authService.login(userData);

			// Assert the expected behavior
			expect(result.message).toBe('Email or password is incorrect');
		});

		it('should return an error if the email is not verified', async () => {
			// Mock isVerified to return false
			jest.spyOn(User.prototype, 'hasVerifiedEmail').mockReturnValue(false);

			// Call the method under test
			const result = await authService.login(userData);

			// Assert the expected behavior
			expect(result.message).toBe('Email is not verified! You must verify your email!!');
		});
	});
});
