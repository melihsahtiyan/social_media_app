import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../../../src/models/entities/User';
import { users } from '../../../src/models/schemas/user.schema';
import IUserRepository from '../../../src/persistence/abstracts/IUserRepository';
import { UserRepository } from '../../../src/persistence/repositories/user-repository';
import { userRepositoryMocks } from './user.repo.mock';

dotenv.config();

describe('UserRepository', () => {
	let userRepository: IUserRepository;
	let userRecords: Array<User> = new Array<User>();
	const recordForDelete: Array<User> = new Array<User>();

	beforeAll(async () => {
		await mongoose.connect(process.env.TEST_CONNECTION_STRING as string);

		userRepository = new UserRepository();

		const firstRecord: User = await users.create(userRepositoryMocks.initialUserMocks[0]);

		const secondRecord: User = await users.create(userRepositoryMocks.initialUserMocks[1]);

		recordForDelete.push(firstRecord);
		recordForDelete.push(secondRecord);
	});

	beforeEach(async () => {
		userRecords = await users.find();
	});

	describe('create', () => {
		it('should create a new user with a valid data', async () => {
			// Act
			const isCreated: boolean = await userRepository.create(userRepositoryMocks.userCreateMocks.validCreationUsers[2]);

			// Assert
			expect(isCreated).toBe(true);
		});

		it('should return false if the data is invalid', async () => {
			// Assert
			await expect(userRepository.create(userRepositoryMocks.userCreateMocks.invalidCreationUsers[0])).rejects.toThrow();
		});
	});

	describe('getAll', () => {
		it('Should return users', async () => {
			const userList: Array<User> = await userRepository.getAll();

			expect(userList).not.toBeNull();
			expect(userList).not.toBeUndefined();
			expect(userList).toHaveLength(userRecords.length);
		});
	});

	afterAll(async () => {
		for (let i = 0; i < recordForDelete.length; i++) {
			await users.findByIdAndDelete(recordForDelete[i]._id);
		}

		await mongoose.connection.close();
	});
});
