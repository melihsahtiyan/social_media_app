import { Dto } from '../Dto';
import { ObjectId } from '../../../types/ObjectId';

export interface CommentInputDto extends Dto {
	creator: ObjectId;
	postId: ObjectId;
	content: string;
};
