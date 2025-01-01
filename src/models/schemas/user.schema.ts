import mongoose from 'mongoose';
import { User } from '../entities/User';

export type UserDoc = mongoose.Document & User;

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
		validate: {
			validator: function (firstName: string) {
				return firstName.length >= 3;
			},
		},
	},
	lastName: {
		type: String,
		required: true,
		validate: {
			validator: function (lastName: string) {
				return lastName.length >= 3;
			},
		},
	},
	birthDate: {
		type: Date,
		required: true,
		validate: {
			validator: function (birthDate: Date) {
				return birthDate < new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 18); // 18 years old
			},
		},
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
		validate: {
			// TODO: Fix email and student email validation
			// validator: function (email: string) {
			// 	return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
			// },
			validator: function (email: string) {
				return email.length >= 5;
			},
			message: 'Invalid email',
		},
	},
	password: { type: String, required: true },
	university: {
		type: String,
		required: true,
		validator: function (university: string) {
			return university.length >= 3;
		},
	},
	department: {
		type: String,
		required: true,
		validator: function (department: string) {
			return department.length >= 3;
		},
	},
	studentEmail: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
		validate: {
			validator: function (email: string) {
				return email.length >= 5;
			},
			message: 'Invalid email',
		},
	},
	status: {
		type: {
			studentVerification: Boolean,
			emailVerification: Boolean,
		},
		default: {
			studentVerification: false,
			emailVerification: false,
		},
		_id: false,
	},
	profilePhotoUrl: { type: String, default: null },
	friends: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			default: [],
		},
	],
	friendRequests: [
		{
			type: { userId: mongoose.Schema.Types.ObjectId, createdAt: Date },
			default: [],
		},
	],
	posts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post',
			default: [],
		},
	],
	organizations: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Club',
			default: [],
		},
	],
	attendances: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Event',
			default: [],
		},
	],
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

const users: mongoose.Model<UserDoc> = mongoose.models.users || mongoose.model<UserDoc>('User', userSchema);

export { users };
