import { Schema } from 'mongoose';

export interface UserForRequestDto {
	_id: Schema.Types.ObjectId;
	firstName: string;
	lastName: string;
	profilePhotoUrl: string;
}
