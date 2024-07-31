import { Schema } from 'mongoose';

export interface CommentForCreateDto {
	creator: Schema.Types.ObjectId;
	post: Schema.Types.ObjectId;
	content: string;
}
