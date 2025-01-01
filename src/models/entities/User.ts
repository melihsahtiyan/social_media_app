import { ObjectId } from '../../types/ObjectId';
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
	friends: ObjectId[];
	friendRequests: { userId: ObjectId; createdAt: Date }[];
	posts: ObjectId[];
	organizations: ObjectId[];
	attendances: ObjectId[];
	constructor(user: Partial<User>) {
		super();
		this._id = user._id;
		this.firstName = user.firstName;
		this.lastName = user.lastName;
		this.birthDate = user.birthDate;
		this.email = user.email;
		this.password = user.password;
		this.university = user.university;
		this.department = user.department;
		this.studentEmail = user.studentEmail;
		this.status = user.status;
		this.profilePhotoUrl = user.profilePhotoUrl;
		this.friends = user.friends;
		this.friendRequests = user.friendRequests;
		this.posts = user.posts;
		this.organizations = user.organizations;
		this.attendances = user.attendances;
		this.createdAt = user.createdAt;
	}
	getId(): string {
		return this._id.toString();
	}
	getFullName(): string {
		return `${this.firstName} ${this.lastName}`;
	}
	isFriendOrSameUniversity(creator: User): boolean {
		return (
			(this.friends.find(friend => friend.toString() === creator._id.toString()) ? true : false) ||
			creator.university === this.university
		);
	}

	isFriend(userId: ObjectId): boolean {
		return this.friends.find(friend => friend.toString() === userId.toString()) ? true : false;
	}

	isVerifiedStudent(): boolean {
		return this.status.studentVerification;
	}

	isVerifiedUser(): boolean {
		return this.status.studentVerification && this.status.emailVerification;
	}

	hasFriendRequest(userId: ObjectId): boolean {
		return this.friendRequests.find(friend => friend.toString() === userId.toString()) ? true : false;
	}

	hasVerifiedEmail(): boolean {
		return this.status.emailVerification;
	}

	static isUnderAge(birthDate: Date): boolean {
		const now = new Date(Date.now());
		const age = now.getFullYear() - birthDate.getFullYear();
		return !!(age < 18);
	}

	addFriendRequest(userId: ObjectId): void {
		this.friendRequests.push({ userId, createdAt: new Date(Date.now()) });
	}

	generateJsonWebToken(): string {
		const token = jwt.sign(
			{
				_id: this._id,
				email: this.email,
				firstName: this.firstName,
				lastName: this.lastName,
			},
			process.env.SECRET_KEY,
			{ expiresIn: process.env.NODE_ENV === 'production' ? '1h' : '100d' }
		);

		return token;
	}
}
