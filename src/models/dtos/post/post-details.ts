import mongoose from "mongoose";
import { UserForPost } from "../user/user-for-post";
import { CommentDoc } from "../../schemas/comment.schema";

export type PostDetails = {
  _id: mongoose.Schema.Types.ObjectId;
  creator: UserForPost;
  content: {
    caption: string;
    mediaUrls: string[];
  };
  type: string;
  likes: mongoose.Schema.Types.ObjectId[];
  likeCount: number;
  comments: CommentDoc[];
  commentCount: number;
  createdAt: Date;
  isUpdated: Boolean;
};
