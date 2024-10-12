import { Dto } from '../Dto';
import { ObjectId } from '../../../types/ObjectId';

export interface CommentForCreateDto extends Dto {
	creator: ObjectId;
	post: ObjectId;
	content: string;
}
