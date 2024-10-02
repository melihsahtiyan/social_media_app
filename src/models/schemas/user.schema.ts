import mongoose from 'mongoose';
import { User } from '../entities/User';

export type UserDoc = mongoose.Document & User;

const userSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	birthDate: Date,
	email: String,
	password: String,
	university: String,
	department: String,
	studentEmail: String,
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
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
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
