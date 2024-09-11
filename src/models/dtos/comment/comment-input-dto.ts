import { ObjectId } from '../../../types/ObjectId';

export type CommentInputDto = {
	creator: ObjectId;
	postId: ObjectId;
	content: string;
};
