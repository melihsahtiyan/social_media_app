import { PostInputDto } from "../../models/dtos/post/post-input-dto";
import { DataResult } from "../result/DataResult";
import { PostDoc } from "../../models/schemas/post.schema";
import PostList from "../../models/dtos/post/post-list";

interface IPostService {
  createPost(
    postInput: PostInputDto,
    userId: string,
    files?: Express.Multer.File[]
  ): Promise<DataResult<PostInputDto>>;

  getPosts(): Promise<DataResult<Array<PostDoc>>>;

  //   getPostById(id: string): Promise<PostDoc | null>;

  //   getPostDetails(id: string): Promise<PostDetails>;

  getAllFriendsPosts(userId: string): Promise<DataResult<Array<PostList>>>;

  //   updatePost(id: string, caption: string): Promise<PostDoc>;

  //   deletePost(id: string): Promise<PostDoc>;
}

export default IPostService;
