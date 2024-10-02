import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../../src/models/entities/User';
import { UserRepository } from '../../src/repositories/user-repository';
import UserForCreate from '../../src/models/dtos/user/user-for-create';
import { users } from '../../src/models/schemas/user.schema';
import { UserListDto } from '../../src/models/dtos/user/user-list-dto';

dotenv.config();

describe('UserRepository', () => {
	let userRepository: UserRepository;
	const userRecords: Array<User> = new Array<User>();

	beforeAll(async () => {
		await mongoose.connect(process.env.TEST_CONNECTION_STRING as string);

		userRepository = new UserRepository();

		const userForCreate: UserForCreate = {
			firstName: 'John',
			lastName: 'Doe',
			email: 'john.doe@example.com',
			password: await User.hashPassword('12345678'),
			birthDate: new Date('1990-01-01'),
			profilePhotoUrl: null,
		};

		const createdUser1 = await users.create(userForCreate);

		userRecords.push(new User(createdUser1.toObject()));

		const userForCreate2: UserForCreate = {
			firstName: 'Jane',
			lastName: 'Doe',
			email: 'jane.doe@example.com',
			password: await User.hashPassword('12345678'),
			birthDate: new Date('1990-01-01'),
			profilePhotoUrl: null,
		};

		const createdUser2 = await users.create(userForCreate2);
		userRecords.push(new User(createdUser2.toObject()));
	});

	beforeEach(() => {});

	describe('create', () => {
		it('should create a new user', async () => {
			// Arrange
			const user: UserForCreate = {
				firstName: 'Melih',
				lastName: 'Sahtiyan',
				email: 'melih@example.com',
				password: await User.hashPassword('12345678'),
				birthDate: new Date('1990-01-01'),
				profilePhotoUrl: null,
			};

			// Act
			const createdUser: User = await userRepository.create(user);
			userRecords.push(createdUser);

			// Assert
			expect(createdUser).toEqual(expect.objectContaining(user));
			expect(createdUser._id).not.toBeNull();
			expect(createdUser._id).not.toBeUndefined();
			expect(createdUser.firstName).toEqual('Melih');
			expect(createdUser.password).not.toEqual('12345678');
		});
	});

	describe('getAll', () => {
		it('Should return users', async () => {
			const userList: Array<UserListDto> = await userRepository.getAll();

			expect(userList).not.toBeNull();
			expect(userList).not.toBeUndefined();
			expect(userList).toHaveLength(3 + userRecords.length);
		});
	});

	afterAll(async () => {
		for (let i = 0; i < userRecords.length; i++) {
			await users.findByIdAndDelete(userRecords[i]._id);
		}

		await mongoose.connection.close();
	});
});
