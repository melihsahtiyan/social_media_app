import { ObjectId } from '../../../types/ObjectId';
import { UserForSearchDto } from '../user/user-for-search-dto';

export interface CommentForListDto {
	_id: ObjectId;
	creator: {
		_id: ObjectId;
		firstName: string;
		lastName: string;
		profilePicture: string;
	};
	content: string;
	isUpdated: boolean;
	createdAt: Date;
	likes: Array<UserForSearchDto>;
	likeCount: number;
	replies: Array<CommentForListDto>;
}
