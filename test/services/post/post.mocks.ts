import { Schema } from 'mongoose';
import { Post } from '../../../src/models/entities/Post';
import { User } from '../../../src/models/entities/User';

const userMocks = {
	validUserMocks: [
		new User({
			_id: new Schema.Types.ObjectId('MockId1'),
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
			status: { emailVerification: true, studentVerification: true },
			organizations: [],
			studentEmail: 'studentEmail@example.com',
		}),
		new User({
			_id: new Schema.Types.ObjectId('MockId2'),
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
			status: { emailVerification: true, studentVerification: true },
			organizations: [],
			studentEmail: 'studentEmail@example.com',
		}),
	],
};

const post = [
	new Post({
		_id: new Schema.Types.ObjectId('MockId'),
		creator: new Schema.Types.ObjectId('MockId1'),
		content: {
			caption: 'Caption',
			mediaUrls: ['mediaUrl'],
		},
		likes: [new Schema.Types.ObjectId('MockId1')],
		createdAt: new Date(),
		comments: [],
		commentCount: 0,
		poll: null,
		event: null,
		isUpdated: false,
	}),
	new Post({
		_id: new Schema.Types.ObjectId('MockId1'),
		creator: new Schema.Types.ObjectId('MockId2'),
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

export const postMocks = {
	post,
	userMocks,
};
