import { User } from '../../../src/models/entities/User';
import { UserRepository } from '../../../src/persistence/repositories/user-repository';
import { AuthService } from '../../../src/application/services/auth.service';
import { authMock } from './auth.mocks';
import IUserRepository from '../../../src/persistence/abstracts/IUserRepository';
import IAuthService from '../../../src/application/abstracts/IAuthService';
import { passwordHandler } from '../../../src/security/passwordHandler';

describe('Auth Service', () => {
	let userRepository: IUserRepository;
	let authService: IAuthService;

	beforeAll(() => {
		userRepository = new UserRepository();
		authService = new AuthService(userRepository);

		// Mock User model
		jest.spyOn(userRepository, 'getByEmail').mockResolvedValue(authMock.initialUserMocks.validInitialMock);
		// Mock comparePassword method
		jest.spyOn(passwordHandler, 'comparePassword').mockResolvedValue(true);

		// Mock other User methods
		jest.spyOn(User.prototype, 'hasVerifiedEmail').mockReturnValue(true);
	});

	beforeEach(() => {});

	describe('register', () => {
		it('should return an error if the user already exists', async () => {
			// Call the method under test
			const result = await authService.register(authMock.registerUserDataMocks.validRegisterMock);

			// Assert the expected behavior
			expect(result.message).toBe('User already exists');
			expect(result.success).toBe(false);
		});

		it('should register a new user with valid data', async () => {
			jest.spyOn(userRepository, 'getByEmail').mockResolvedValueOnce(null);

			jest.spyOn(userRepository, 'create').mockResolvedValueOnce(true);

			// Call the method under test
			const result = await authService.register(authMock.registerUserDataMocks.validRegisterMock);

			// Assert the expected behavior
			expect(result.message).toBe('User registered successfully');
			expect(result.success).toBe(true);
		});

		it('should return an error if the user is under 18 years old', async () => {
			jest.spyOn(userRepository, 'getByEmail').mockReturnValue(null);

			jest.mock('../../../src/models/entities/User', () => {
				return {
					...jest.requireActual('../../../src/models/entities/User'),
					isUnderAge: jest.fn().mockReturnValue(false),
				};
			});

			// Call the method under test
			const result = await authService.register(authMock.registerUserDataMocks.underAgeRegisterMock);

			// Assert the expected behavior
			expect(result.message).toBe('You must be 18 years old');
			expect(result.success).toBe(false);
		});
	});

	describe('login', () => {
		it('should login a user with valid credentials', async () => {
			jest.spyOn(User.prototype, 'generateJsonWebToken').mockImplementationOnce(() => {
				return 'mockedToken';
			});

			jest.spyOn(userRepository, 'getByEmail').mockResolvedValueOnce(authMock.initialUserMocks.validInitialMock);

			// Call the method under test
			const result = await authService.login(authMock.loginUserDataMocks.validLoginMock);

			// Assert the expected behavior
			expect(result.message).toBe('Login successful! Token generated');
			expect(result.success).toBe(true);
			expect(result.data.token).toBe('mockedToken');
		});

		it('should return an error if the user does not exist', async () => {
			jest.spyOn(userRepository, 'getByEmail').mockResolvedValueOnce(null);

			// Call the method under test
			const result = await authService.login(authMock.loginUserDataMocks.validLoginMock);

			// Assert the expected behavior
			expect(result.message).toBe('Email or password is incorrect!');
			expect(result.success).toBe(false);
		});

		it('should return an error if the password is incorrect', async () => {
			// Mock comparePassword to return false
			jest.spyOn(userRepository, 'getByEmail').mockResolvedValueOnce(authMock.initialUserMocks.validInitialMock);
			jest.spyOn(passwordHandler, 'comparePassword').mockResolvedValueOnce(false);

			// Call the method under test
			const result = await authService.login(authMock.loginUserDataMocks.invalidLoginMock);

			// Assert the expected behavior
			expect(result.message).toBe('Email or password is incorrect');
			expect(result.success).toBe(false);
		});

		it('should return an error if the email is not verified', async () => {
			// Mock isVerified to return false
			jest.spyOn(userRepository, 'getByEmail').mockResolvedValue(authMock.initialUserMocks.validInitialMock);
			jest.spyOn(passwordHandler, 'comparePassword').mockResolvedValue(true);
			jest.spyOn(User.prototype, 'hasVerifiedEmail').mockReturnValue(false);

			// Call the method under test
			const result = await authService.login(authMock.loginUserDataMocks.validLoginMock);

			// Assert the expected behavior
			expect(result.message).toBe('Email is not verified! You must verify your email!!');
			expect(result.success).toBe(false);
		});
	});
});
