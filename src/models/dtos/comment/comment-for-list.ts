import { Schema } from 'mongoose';
import { UserForSearchDto } from '../user/user-for-search-dto';

export interface CommentForListDto {
	_id: Schema.Types.ObjectId;
	creator: {
		_id: Schema.Types.ObjectId;
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
