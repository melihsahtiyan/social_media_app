import { Comment } from '../../models/entities/Comment';
import { IRepositoryBase } from './IRepositoryBase';

export interface ICommentRepository extends IRepositoryBase<Comment> {
	reply(commentId: string, reply: Comment): Promise<boolean>;
	getCommentsByPostId(postId: string): Promise<Array<Comment>>;
}
