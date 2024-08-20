import { Schema } from 'mongoose';
import { PostForCreate } from '../../models/dtos/post/post-for-create';
import { PostDoc } from '../../models/schemas/post.schema';
import { Post } from '../../models/entites/Post';

interface IPostRepository {
	createPost(post: PostForCreate): Promise<PostDoc>;
	getAllPopulatedPosts(pages?: number): Promise<PostDoc[]>;
	// getPostById(id: string): Promise<PostDetails>;
	getById(id: string): Promise<Post>;
	// getPostsByUserId(userId: Schema.Types.ObjectId): Promise<PostDoc[]>;
	getFriendsPosts(userId: string): Promise<Array<Post>>;
	getAllUniversityPosts(university: string): Promise<Array<Post>>;
	updateCaption(id: string, caption: string): Promise<Post>;
	updatePost(post: PostDoc): Promise<Post>;
	deletePost(id: Schema.Types.ObjectId): Promise<boolean>;
	likePost(postId: Schema.Types.ObjectId, userId: Schema.Types.ObjectId): Promise<Post>;
	unlikePost(postId: Schema.Types.ObjectId, userId: Schema.Types.ObjectId): Promise<Post>;
}

export default IPostRepository;
