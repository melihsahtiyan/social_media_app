import 'reflect-metadata';
import { comments } from '../models/schemas/comment.schema';
import { Comment } from '../models/entities/Comment';
import { ICommentRepository } from '../types/repositories/ICommentRepository';
import { injectable } from 'inversify';
import { RepositoryBase } from './repository-base';

@injectable()
export class CommentRepository extends RepositoryBase<Comment> implements ICommentRepository {
	constructor() {
		super(comments, Comment);
	}

	// TODO: Decide if the reply should be added to the database or not
	async reply(commentId: string, reply: Comment): Promise<boolean> {
		const comment = await this.model.findById(commentId);
		const createdReply = await this.model.create(reply);

		comment.replies.push(createdReply._id);

		const savedComment: Comment = await comment.save();

		return !!savedComment;
	}

	async getCommentsByPostId(postId: string): Promise<Array<Comment>> {
		const postComments: Array<Comment> = await this.model
			.find({ post: postId })
			.populate('creator', '_id firstName lastName profilePhotoUrl')
			.populate('likes', '_id firstName lastName profilePhotoUrl')
			.populate('replies', '_id content creator likes createdAt');

		return postComments;
	}
}
