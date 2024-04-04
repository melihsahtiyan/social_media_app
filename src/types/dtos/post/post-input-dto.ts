import { UserForPost } from "../user/user-for-post";

interface PostInputDto {
  creator: UserForPost;
  caption: string;
  mediaUrls: string[];
  type: string;
}
export { PostInputDto };
