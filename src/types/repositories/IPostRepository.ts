import { Schema } from 'mongoose';
import { PostForCreate } from '../../models/dtos/post/post-for-create';
import { PostDoc } from '../../models/schemas/post.schema';
import { Post } from '../../models/entities/Post';
import { IRepositoryBase } from './IRepositoryBase';

interface IPostRepository extends IRepositoryBase<Post> {
	getAllPopulatedPosts(pages?: number): Promise<PostDoc[]>;
	// getPostById(id: string): Promise<PostDetails>;
	// getPostsByUserId(userId: Schema.Types.ObjectId): Promise<PostDoc[]>;
	getFriendsPosts(userId: string): Promise<Array<Post>>;
	getAllUniversityPosts(university: string): Promise<Array<Post>>;
	updateCaption(id: string, caption: string): Promise<Post>;
	likePost(postId: Schema.Types.ObjectId, userId: Schema.Types.ObjectId): Promise<Post>;
	unlikePost(postId: Schema.Types.ObjectId, userId: Schema.Types.ObjectId): Promise<Post>;
}

export default IPostRepository;
