import mongoose from "mongoose";
import { UserForPost } from "../user/user-for-post";
import { CommentDoc } from "../../mongoose/CommentDoc";

export type PostDetails = {
  _id: mongoose.Schema.Types.ObjectId;
  creator: UserForPost;
  content: {
    caption: string;
    mediaUrls: string[];
  };
  type: string;
  likes: mongoose.Schema.Types.ObjectId[];
  comments: CommentDoc[];
  createdAt: Date;
  isUpdated: Boolean;
};
