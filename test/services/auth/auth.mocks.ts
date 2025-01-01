import mongoose from 'mongoose';
import { User } from '../../../src/models/entities/User';
import UserForRegister from '../../../src/models/dtos/user/user-for-register';
import UserForLogin from '../../../src/models/dtos/user/user-for-login';

const initialUserMocks = {
	invalidInitialMock: new User({
		_id: new mongoose.Schema.Types.ObjectId('mockId'),
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
	}),
	validInitialMock: new User({
		_id: new mongoose.Schema.Types.ObjectId('mockId'),
		firstName: 'John',
		lastName: 'Doe',
		birthDate: new Date(),
		email: 'john.doe@example.com',
		password: 'password123',
		university: 'Mocked University',
		department: 'Mocked Department',
		studentEmail: 'john.doe@student.example.com',
		status: { studentVerification: true, emailVerification: true },
		profilePhotoUrl: null,
		friends: [],
		friendRequests: [],
		posts: [],
		organizations: [],
		attendances: [],
		createdAt: new Date(),
	}),
};

const registerUserDataMocks = {
	validRegisterMock: {
		firstName: 'John',
		lastName: 'Doe',
		birthDate: new Date('01-31-2000'),
		email: 'john.doe@example.com',
		password: 'password123',
	} as UserForRegister,
	underAgeRegisterMock: {
		firstName: 'John',
		lastName: 'Doe',
		birthDate: new Date('01-31-2010'),
		email: 'john.doe@example.com',
		password: 'password123',
	} as UserForRegister,
};

const loginUserDataMocks = {
	validLoginMock: {
		email: 'john.doe@example.com',
		password: 'password123',
	} as UserForLogin,
	invalidLoginMock: {
		email: 'john.doe@example.com',
		password: 'password122',
	} as UserForLogin,
};

export const authMock = {
	initialUserMocks,
	registerUserDataMocks,
	loginUserDataMocks,
};
