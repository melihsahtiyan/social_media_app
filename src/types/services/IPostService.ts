import { PostInputDto } from "../../models/dtos/post/post-input-dto";
import { DataResult } from "../result/DataResult";
import { PostDoc } from "../../models/schemas/post.schema";
import PostList from "../../models/dtos/post/post-list";
import { PostDetails } from "../../models/dtos/post/post-details";
import { PostForLike } from "../../models/dtos/post/post-for-like";

interface IPostService {
  createPost(
    postInput: PostInputDto,
    userId: string,
    files?: Express.Multer.File[]
  ): Promise<DataResult<PostInputDto>>;

  getAllPosts(): Promise<DataResult<Array<PostDoc>>>;

  getPostById(id: string): Promise<PostDoc | null>;

  getPostDetails(
    postId: string,
    userId: string
  ): Promise<DataResult<PostDetails>>;

  getAllFriendsPosts(userId: string): Promise<DataResult<Array<PostList>>>;
  likePost(postId: string, userId: string): Promise<DataResult<PostForLike>>;
  unlikePost(postId: string, userId: string): Promise<DataResult<PostForLike>>;

  //   updatePost(id: string, caption: string): Promise<PostDoc>;

  //   deletePost(id: string): Promise<PostDoc>;
}

export default IPostService;
