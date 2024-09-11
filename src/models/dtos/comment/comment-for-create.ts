import { ObjectId } from '../../../types/ObjectId';

export interface CommentForCreateDto {
	creator: ObjectId;
	post: ObjectId;
	content: string;
}
