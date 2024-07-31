import mongoose from 'mongoose';
import { PostDetails } from '../post/post-details';

export interface UserProfileDto {
	_id: mongoose.Schema.Types.ObjectId;
	firstName: string;
	lastName: string;
	email: string;
	profilePhotoUrl: string;
	university: string;
	department: string;
	friends: Array<{
		_id: mongoose.Schema.Types.ObjectId;
		firstName: string;
		lastName: string;
		profilePhotoUrl: string;
	}>;
	friendCount: number;
	friendRequests: Array<{
		_id: mongoose.Schema.Types.ObjectId;
		firstName: string;
		lastName: string;
		profilePhotoUrl: string;
	}>;
	posts: Array<PostDetails>;
	createdAt: Date;
	updatedAt: Date;
	isFriend: boolean;
}
