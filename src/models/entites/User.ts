import mongoose, { Schema } from 'mongoose';
import { Entity } from './Entity';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export class User extends Entity {
	firstName: string;
	lastName: string;
	birthDate: Date;
	email: string;
	password: string;
	university: string;
	department: string;
	studentEmail: string;
	status: {
		studentVerification: boolean;
		emailVerification: boolean;
	};
	profilePhotoUrl: string;
	friends: mongoose.Schema.Types.ObjectId[];
	// friendRequests: { userId: mongoose.Schema.Types.ObjectId; createdAt: Date }[];
	friendRequests: mongoose.Schema.Types.ObjectId[];
	posts: mongoose.Schema.Types.ObjectId[];
	organizations: mongoose.Schema.Types.ObjectId[];
	attendances: mongoose.Schema.Types.ObjectId[];
	constructor({
		_id,
		firstName,
		lastName,
		birthDate,
		email,
		password,
		university,
		department,
		studentEmail,
		status,
		profilePhotoUrl,
		friends,
		friendRequests,
		posts,
		organizations,
		attendances,
		createdAt
	}) {
		super();
		this._id = _id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.birthDate = birthDate;
		this.email = email;
		this.password = password;
		this.university = university;
		this.department = department;
		this.studentEmail = studentEmail;
		this.status = status;
		this.profilePhotoUrl = profilePhotoUrl;
		this.friends = friends;
		this.friendRequests = friendRequests;
		this.posts = posts;
		this.organizations = organizations;
		this.attendances = attendances;
		this.createdAt = createdAt;
	}
	getId(): string {
		return this._id.toString();
	}
	generateJsonWebToken(): string {
		const token = jwt.sign(
			{
				_id: this._id,
				email: this.email,
				firstName: this.firstName,
				lastName: this.lastName
			},
			process.env.SECRET_KEY
			// { expiresIn: "1h" }
		);
		return token;
	}
	isFriendOrSameUniversity(creator: User): boolean {
		return this.friends.includes(creator._id) || creator.university === this.university;
	}

	isFriend(userId: Schema.Types.ObjectId): boolean {
		return this.friends.includes(userId) ? true : false;
	}
	hasFriendRequest(userId: Schema.Types.ObjectId): boolean {
		return this.friendRequests.includes(userId) ? true : false;
	}

	static async hashPassword(password: string): Promise<string> {
		return bcrypt.hash(password, 12);
	}

	async comparePassword(password: string): Promise<boolean> {
		return await bcrypt.compare(password, this.password);
	}

	isVerified(): boolean {
		return this.status.emailVerification;
	}
}
