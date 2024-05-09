import mongoose from "mongoose";
import { UserForPost } from "../user/user-for-post";
import { CommentDoc } from "../../schemas/comment.schema";
import { Poll } from "src/models/entites/Poll";

export interface PostDetails {
  _id: mongoose.Schema.Types.ObjectId;
  creator: UserForPost;
  content: {
    caption: string;
    mediaUrls: string[];
  };
  poll: Poll;
  likes: mongoose.Schema.Types.ObjectId[];
  likeCount: number;
  comments: mongoose.Schema.Types.ObjectId[];
  commentCount: number;
  createdAt: Date;
  isUpdated: boolean;
  isLiked: boolean;
}
