import 'reflect-metadata';
import { injectable } from 'inversify';
import { posts, PostDoc } from '../models/schemas/post.schema';
import { UserDoc, users } from '../models/schemas/user.schema';
import { PostForCreate } from '../models/dtos/post/post-for-create';
import IPostRepository from '../types/repositories/IPostRepository';
import { Post } from '../models/entities/Post';
import { RepositoryBase } from './repository-base';
import { ObjectId } from '../types/ObjectId';

@injectable()
export class PostRepository extends RepositoryBase<Post> implements IPostRepository {
	constructor() {
		super(posts, Post);
	}

	async create(postForCreate: PostForCreate): Promise<boolean> {
		const createdPost: PostDoc = await this.model.create({ ...postForCreate });

		await users.findByIdAndUpdate(createdPost.creator, { $push: { posts: createdPost._id } }, { new: true });

		return !!createdPost;
	}
	async getAllUniversityPosts(university: string): Promise<Array<Post>> {
		const usersFromUniversity: UserDoc[] = await this.model.find({
			university: university,
		});

		const fetchedPosts: PostDoc[] = await this.model
			.find({ creator: { $in: usersFromUniversity.map(user => user._id) } })
			.populate('creator', 'firstName lastName profilePhotoUrl')
			.populate('likes', 'firstName lastName profilePhotoUrl')
			.sort({ createdAt: 1 });

		return fetchedPosts.map(post => new Post(post.toObject()));
	}

	async getAllPopulatedPosts(pages?: number): Promise<PostDoc[]> {
		return await this.model
			.find()
			.populate('creator', 'firstName lastName profilePhotoUrl')
			.sort({ createdAt: 1 })
			.limit(pages ? pages : null);
	}
	// async getPostsByUserId(userId: mongoose.Schema.Types.ObjectId): Promise<PostDoc[]> {
	// 	throw new Error('Method not implemented.');
	// }

	async getFriendsPosts(userId: string): Promise<Post[]> {
		const user: UserDoc = await users.findById(userId);

		const postDocList: Array<PostDoc> = await this.model
			.find({ creator: { $in: user.friends } })
			.populate('creator', 'firstName lastName profilePhotoUrl')
			.sort({ createdAt: 1 });

		const postList: Post[] = postDocList.map(doc => {
			return new Post(doc.toObject());
		});

		return postList;
	}

	async updateCaption(id: string, caption: string): Promise<Post> {
		const updatedPost: PostDoc = await this.model.findByIdAndUpdate(
			id,
			{ 'content.caption': caption, isUpdated: true },
			{ new: true }
		);

		return new Post(updatedPost.toObject());
	}

	async likePost(postId: ObjectId, userId: ObjectId): Promise<Post> {
		const post: PostDoc = await this.model.findById(postId);

		const version = post.__v;

		const updatedPost: PostDoc = await this.model.findByIdAndUpdate(
			{ _id: postId, __v: version },
			{ $push: { likes: userId } },
			{ new: true }
		);
		return new Post(updatedPost.toObject());
	}
	async unlikePost(postId: ObjectId, userId: ObjectId): Promise<Post> {
		const post: PostDoc = await this.model.findById(postId);

		const version = post.__v;

		const updatedPost: PostDoc = await this.model.findByIdAndUpdate(
			{ _id: postId, __v: version },
			{ $pull: { likes: userId } },
			{ new: true }
		);
		return new Post(updatedPost.toObject());
	}
}
