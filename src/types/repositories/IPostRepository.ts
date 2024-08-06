import { Schema } from 'mongoose';
import { PostDetails } from '../../models/dtos/post/post-details';
import { PostForCreate } from '../../models/dtos/post/post-for-create';
import { PostDoc } from '../../models/schemas/post.schema';
import { Post } from '../../models/entites/Post';

interface IPostRepository {
	getAllPosts(pages?: number): Promise<PostDoc[]>;
	getPostById(id: string): Promise<PostDetails>;
	getById(id: string): Promise<Post>;
	getPostDetailsById(id: string): Promise<PostDetails>;
	// getPostsByUserId(userId: Schema.Types.ObjectId): Promise<PostDoc[]>;
	getFriendsPosts(userId: string): Promise<Post[]>;
	getAllUniversityPosts(university: string): Promise<Array<Post>>;
	createPost(post: PostForCreate): Promise<PostDoc>;
	updateCaption(id: string, caption: string): Promise<PostDoc>;
	updatePost(post: PostDoc): Promise<PostDoc>;
	deletePost(id: Schema.Types.ObjectId): Promise<boolean>;
	likePost(postId: Schema.Types.ObjectId, userId: Schema.Types.ObjectId): Promise<Post>;
	unlikePost(postId: Schema.Types.ObjectId, userId: Schema.Types.ObjectId): Promise<Post>;
}

export default IPostRepository;
