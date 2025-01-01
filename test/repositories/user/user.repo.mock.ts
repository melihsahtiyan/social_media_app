import UserForCreate from '../../../src/models/dtos/user/user-for-create';
import { User } from '../../../src/models/entities/User';
import { passwordHandler } from '../../../src/security/passwordHandler';

const userCreateMocks = {
	validCreationUsers: [
		{
			firstName: 'John',
			lastName: 'Doe',
			email: 'john.doe@example.com',
			studentEmail: 'john.doe@student.edu.usa',
			password: passwordHandler.hashPassword.bind('12345678'),
			birthDate: new Date('1990-01-01'),
			profilePhotoUrl: null,
			university: 'Mocked University',
			department: 'Mocked Department',
		},
		{
			firstName: 'Jane',
			lastName: 'Doe',
			email: 'jane.doe@example.com',
			studentEmail: 'jane.doe@stuedent.edu.usa',
			password: passwordHandler.hashPassword.bind('12345678'),
			birthDate: new Date('1990-01-01'),
			profilePhotoUrl: null,
			university: 'Mocked University',
			department: 'Mocked Department',
		},
		{
			firstName: 'Melih',
			lastName: 'Sahtiyan',
			email: 'melih@example.com',
			studentEmail: 'melih@student.edu.tr',
			password: passwordHandler.hashPassword.bind('12345678'),
			birthDate: new Date('1990-01-01'),
			profilePhotoUrl: null,
			university: 'Mocked University',
			department: 'Mocked Department',
		},
	] as Array<UserForCreate>,
	invalidCreationUsers: [
		{
			firstName: 'John',
			lastName: 'Doe',
			password: passwordHandler.hashPassword.bind('12345678'),
			birthDate: new Date('1990-01-01'),
			profilePhotoUrl: null,
		},
	],
};

const initialUserMocks: Array<User> = [
	new User({
		firstName: 'John',
		lastName: 'Doe',
		birthDate: new Date('1990-01-01'),
		email: 'john.doe@example.com',
		password: passwordHandler.hashPassword.bind('12345678'),
		university: 'Mocked University',
		department: 'Mocked Department',
		studentEmail: 'john.doe@student.edu.us',
		status: { studentVerification: true, emailVerification: true },
		profilePhotoUrl: 'mockedProfilePhotoUrl',
		friends: [],
		friendRequests: [],
		posts: [],
		organizations: [],
		attendances: [],
		createdAt: new Date(Date.now()),
	}),
	new User({
		firstName: 'Jane',
		lastName: 'Doe',
		birthDate: new Date('1990-01-01'),
		email: 'jane.doe@xample.com',
		password: passwordHandler.hashPassword.bind('12345678'),
		university: 'Mocked University',
		department: 'Mocked Department',
		studentEmail: 'jane.doe@student.edu.us',
		status: { studentVerification: true, emailVerification: true },
		profilePhotoUrl: 'mockedProfilePhotoUrl',
		friends: [],
		friendRequests: [],
		posts: [],
		organizations: [],
		attendances: [],
		createdAt: new Date(Date.now()),
	}),
];

export const userRepositoryMocks = {
	userCreateMocks,
	initialUserMocks,
};
