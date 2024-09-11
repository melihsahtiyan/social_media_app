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
	// friendRequests: { userId: ObjectId; createdAt: Date }[];
	friendRequests: ObjectId[];
	posts: ObjectId[];
	organizations: ObjectId[];
	attendances: ObjectId[];
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
		createdAt,
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
	getFullName(): string {
		return `${this.firstName} ${this.lastName}`;
	}
	generateJsonWebToken(): string {
		const token = jwt.sign(
			{
				_id: this._id,
				email: this.email,
				firstName: this.firstName,
				lastName: this.lastName,
			},
			process.env.SECRET_KEY
			// ,{ expiresIn: "1h" }
		);
		return token;
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
	hasFriendRequest(userId: ObjectId): boolean {
		return this.friendRequests.find(friend => friend.toString() === userId.toString()) ? true : false;
	}

	static async hashPassword(password: string): Promise<string> {
		return await bcrypt.hash(password, 12);
	}

	async comparePassword(password: string): Promise<boolean> {
		return await bcrypt.compare(password, this.password);
	}

	hasVerifiedEmail(): boolean {
		return this.status.emailVerification;
	}

	isVerifiedStudent(): boolean {
		return this.status.studentVerification;
	}
}
