import 'reflect-metadata';
import { injectable } from 'inversify';
import { posts, PostDoc } from '../models/schemas/post.schema';
import { UserDoc, users } from '../models/schemas/user.schema';
import { PostForCreate } from '../models/dtos/post/post-for-create';
import mongoose from 'mongoose';
import IPostRepository from '../types/repositories/IPostRepository';
import { Post } from '../models/entites/Post';
import { Schema } from 'mongoose';

@injectable()
export class PostRepository implements IPostRepository {
	constructor() {}

	async createPost(postForCreate: PostForCreate): Promise<PostDoc> {
		const createdPost: PostDoc = await posts.create({ ...postForCreate });

		const creator: UserDoc = await users.findById(createdPost.creator);
		creator.posts.push(createdPost._id);
		await creator.save();

		return createdPost;
	}
	async getAllUniversityPosts(university: string): Promise<Array<Post>> {
		const usersFromUniversity: UserDoc[] = await users.find({
			university: university,
		});

		return await posts
			.find({ creator: { $in: usersFromUniversity.map(user => user._id) } })
			.populate('creator', 'firstName lastName profilePhotoUrl')
			.populate('likes', 'firstName lastName profilePhotoUrl')
			.sort({ createdAt: 1 });
	}

	async getAllPopulatedPosts(pages?: number): Promise<PostDoc[]> {
		return await posts
			.find()
			.populate('creator', 'firstName lastName profilePhotoUrl')
			.sort({ createdAt: 1 })
			.limit(pages ? pages : null);
	}
	// async getPostsByUserId(userId: mongoose.Schema.Types.ObjectId): Promise<PostDoc[]> {
	// 	throw new Error('Method not implemented.');
	// }

	async getById(postId: string): Promise<Post> {
		const result: Post = await posts.findById(postId);
		const post: Post = new Post({
			_id: result._id,
			creator: result.creator,
			content: result.content,
			likes: result.likes,
			comments: result.comments,
			commentCount: result.commentCount,
			poll: result.poll,
			event: result.event,
			isUpdated: result.isUpdated,
			createdAt: result.createdAt,
		});
		return post;
	}

	async getFriendsPosts(userId: string): Promise<Post[]> {
		const user: UserDoc = await users.findById(userId);

		const postDocList: Array<PostDoc> = await posts
			.find({ creator: { $in: user.friends } })
			.populate('creator', 'firstName lastName profilePhotoUrl')
			.sort({ createdAt: 1 });

		const postList: Post[] = postDocList.map(doc => {
			return new Post(doc.toObject());
		});

		return postList;
	}

	async updateCaption(id: string, caption: string): Promise<Post> {
		const updatedPost: PostDoc = await posts.findByIdAndUpdate(
			id,
			{ 'content.caption': caption, isUpdated: true },
			{ new: true }
		);

		return new Post(updatedPost.toObject());
	}
	async updatePost(post: PostDoc): Promise<Post> {
		const updatedPost: PostDoc = await posts.findByIdAndUpdate(post._id, { ...post, isUpdated: true }, { new: true });

		return new Post(updatedPost.toObject());
	}

	async deletePost(id: Schema.Types.ObjectId): Promise<boolean> {
		const postToDelete: PostDoc = await posts.findById(id);

		const creator: UserDoc = await users.findById(postToDelete.creator);
		creator.posts = creator.posts.filter(postId => postId.toString() !== id.toString());
		await creator.save();

		const deletedPost = await posts.findByIdAndDelete(id);

		return deletedPost ? true : false;
	}

	async likePost(postId: mongoose.Schema.Types.ObjectId, userId: mongoose.Schema.Types.ObjectId): Promise<Post> {
		const post: PostDoc = await posts.findById(postId);

		post.likes.push(userId);

		const updatedPost: PostDoc = await post.save();
		return new Post(updatedPost.toObject());
	}
	async unlikePost(postId: mongoose.Schema.Types.ObjectId, userId: mongoose.Schema.Types.ObjectId): Promise<Post> {
		const post: PostDoc = await posts.findById(postId);

		post.likes = post.likes.filter(like => like.toString() !== userId.toString());
		const updatedPost = await post.save();

		return new Post(updatedPost.toObject());
	}
}
