import { UserForPost } from "../user/user-for-post";

export interface PostForCreate {
  creator: UserForPost;
  content: { caption: string; mediaUrls: Array<string> };
  likes: [];
  comments: [];
  type: string;
}
