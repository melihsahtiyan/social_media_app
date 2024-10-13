import { DataResult } from '../result/DataResult';
import { Result } from '../result/Result';
import { CommentForCreateDto } from '../../models/dtos/comment/comment-for-create';
import { CommentInputDto } from '../../models/dtos/comment/comment-input-dto';
import { Comment } from '../../models/entities/Comment';

export interface ICommentService {
	create(comment: CommentInputDto, userId: string): Promise<Result>;
	reply(commentId: string, reply: CommentInputDto, userId: string): Promise<Result>;
	// getById(id: string): Promise<DataResult<CommentDoc>>;
	getCommentsByPostId(postId: string): Promise<DataResult<Array<Comment>>>;
	update(id: string, userId: string, content: string): Promise<Result>;
	delete(id: string, userId: string): Promise<Result>;
}
