import { Schema } from "mongoose";
import { PostDetails } from "../../models/dtos/post/post-details";
import { PostForCreate } from "../../models/dtos/post/post-for-create";
import { PostDoc } from "../../models/schemas/post.schema";
import { PostForLike } from "src/models/dtos/post/post-for-like";
import { Post } from "src/models/entites/Post";

interface IPostRepository {
  getAllPosts(pages?: number): Promise<PostDoc[]>;
  getPostById(id: string): Promise<PostDetails>;
  getPostDetailsById(id: string): Promise<PostDetails>;
  getPostsByUserId(userId: Schema.Types.ObjectId): Promise<PostDoc[]>;
  getFriendsPosts(userId: Schema.Types.ObjectId): Promise<PostDoc[]>;
  getAllUniversityPosts(
    userId: Schema.Types.ObjectId,
    university: string
  ): Promise<Array<Post>>;
  createPost(post: PostForCreate): Promise<PostDoc>;
  updateCaption(id: string, caption: string): Promise<PostDoc>;
  updatePost(post: PostDoc): Promise<PostDoc>;
  deletePost(id: string): Promise<PostDoc>;
  likePost(
    postId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId
  ): Promise<PostForLike>;
  unlikePost(
    postId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId
  ): Promise<PostForLike>;
}

export default IPostRepository;
