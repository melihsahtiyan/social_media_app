import mongoose from "mongoose";
import { PostDetails } from "../../models/dtos/post/post-details";
import { PostForCreate } from "../../models/dtos/post/post-for-create";
import { PostDoc } from "../../models/schemas/post.schema";
import { PostForLike } from "src/models/dtos/post/post-for-like";

interface IPostRepository {
  getAllPosts(pages?: number): Promise<PostDoc[]>;

  getPostById(id: string): Promise<PostDoc | null>;

  getPostDetailsById(id: string): Promise<PostDetails>;
  getPostsByUserId(userId: mongoose.Schema.Types.ObjectId): Promise<PostDoc[]>;

  getFriendsPosts(userId: mongoose.Schema.Types.ObjectId): Promise<PostDoc[]>;

  getAllInUniversityPosts(university: string): Promise<PostDoc[]>;

  createPost(post: PostForCreate): Promise<PostDoc>;

  updatePost(id: string, caption: string): Promise<PostDoc>;

  deletePost(id: string): Promise<PostDoc>;

  likePost(postId: mongoose.Schema.Types.ObjectId, userId: mongoose.Schema.Types.ObjectId): Promise<PostForLike>;

  unlikePost(postId: mongoose.Schema.Types.ObjectId, userId: mongoose.Schema.Types.ObjectId): Promise<PostForLike>;
}

export default IPostRepository;
