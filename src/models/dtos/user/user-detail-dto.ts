import mongoose from 'mongoose';

export interface UserDetailDto {
	_id: mongoose.Schema.Types.ObjectId;
	firstName: string;
	lastName: string;
	email: string;
	profilePhotoUrl: string;
	university: string;
	department: string;
	friends: Array<{
		_id: string;
		firstName: string;
		lastName: string;
	}>;
	friendCount: number;
	createdAt: Date;
	updatedAt: Date;
	isFriend: boolean;
}
