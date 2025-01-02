import { PostInputDto } from "../../models/dtos/post/post-input-dto";
import { PostDoc } from "../../models/schemas/post.schema";
import PostListDto from "../../models/dtos/post/post-list";
import { PostDetails } from "../../models/dtos/post/post-details";
import { Result } from "../../types/result/Result";
import { DataResult } from "../../types/result/DataResult";
import { ObjectId } from "../../types/ObjectId";
import { Post } from "../../models/entities/Post";

interface IPostService {
  createPost(
    postInput: PostInputDto,
    userId: string,
		files?: Express.Multer.File[]
	): Promise<Result>;
	getAllPosts(): Promise<DataResult<Array<PostDoc>>>;
	getAllFriendsPosts(userId: string): Promise<DataResult<Array<PostListDto>>>;
	getAllUniversityPosts(userId: string): Promise<DataResult<Array<PostListDto>>>;
	getPostDetails(
    postId: string,
    userId: string
  ): Promise<DataResult<PostDetails>>;
  getPostById(postId: string, userId: string): Promise<DataResult<Post>>;
  getTotalLikes(postIds: Array<ObjectId>): Promise<DataResult<number>>;
  likePost(postId: string, userId: string): Promise<DataResult<number>>;
  unlikePost(postId: string, userId: string): Promise<DataResult<number>>;
  //   updatePost(id: string, caption: string): Promise<PostDoc>;
  deletePost(id: string, userId: string): Promise<Result>;
}

export default IPostService;
