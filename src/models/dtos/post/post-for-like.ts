import { ObjectId } from '../../../types/ObjectId';

export interface PostForLike {
	_id: ObjectId;
	creator: ObjectId;
	content: { caption: string; mediaUrls: string[] };
	likes: ObjectId[];
	likeCount: number;
	isUpdated: boolean;
}
