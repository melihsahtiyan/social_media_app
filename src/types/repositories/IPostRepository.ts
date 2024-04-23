import mongoose from "mongoose";
import { PostDetails } from "../../models/dtos/post/post-details";
import { PostForCreate } from "../../models/dtos/post/post-for-create";
import { PostDoc } from "../../models/schemas/post.schema";

interface IPostRepository {
  createPost(post: PostForCreate): Promise<PostDoc>;

  getAllPosts(pages?: number): Promise<PostDoc[]>;

  getPostById(id: string): Promise<PostDoc | null>;

  getPostDetails(id: string): Promise<PostDetails>;

  getFollowingPosts(userId: mongoose.Schema.Types.ObjectId): Promise<PostDoc[]>;

  updatePost(id: string, caption: string): Promise<PostDoc>;

  deletePost(id: string): Promise<PostDoc>;
}

export default IPostRepository;
