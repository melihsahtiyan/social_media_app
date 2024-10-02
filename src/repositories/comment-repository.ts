import "reflect-metadata"
import { comments } from '../models/schemas/comment.schema';
import { Comment } from '../models/entities/Comment';
import { ICommentRepository } from '../types/repositories/ICommentRepository';
import { injectable } from 'inversify';
import { posts } from '../models/schemas/post.schema';

@injectable()
export class CommentRepository implements ICommentRepository {
	constructor() {}

	async create(comment: Comment): Promise<Comment> {
		const commentForCreate = await comments.create(comment);
		await posts.findByIdAndUpdate(comment.post, { $push: { comments: commentForCreate._id } }, { new: true });

		return comment;
	}

	// TODO: Decide if the reply should be added to the database or not
	async reply(commentId: string, reply: Comment): Promise<Comment> {
		const comment = await comments.findById(commentId);
		const createdReply = await comments.create(reply);

		comment.replies.push(createdReply._id);

		return await comment.save();
	}

	async getById(id: string): Promise<Comment> {
		const comment = await comments.findById(id);
		const result = new Comment(comment);

		return result;
	}

	async getCommentsByPostId(postId: string): Promise<Array<Comment>> {
		const postComments: Array<Comment> = await comments
			.find({ post: postId })
			.populate('creator', '_id firstName lastName profilePhotoUrl')
			.populate('likes', '_id firstName lastName profilePhotoUrl')
			.populate('replies', '_id content creator likes createdAt');

		return postComments;
	}

	async delete(id: string): Promise<boolean> {
		const deletedComment = await comments.findByIdAndDelete(id);

		return !!deletedComment;
	}

	async update(id: string, content: string): Promise<boolean> {
		return await comments.findByIdAndUpdate(id, { content }, { new: true });
	}
}
