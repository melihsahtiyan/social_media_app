import mongoose from "mongoose";
import { CommentDoc } from "../../schemas/comment.schema";
import { Poll } from "../../../models/entites/Poll";

interface PostList {
  _id: mongoose.Schema.Types.ObjectId;
  creator: mongoose.Schema.Types.ObjectId;
  content: { caption: string; files: string[] };
  likes: mongoose.Schema.Types.ObjectId[];
  comments: mongoose.Schema.Types.ObjectId[];
  poll: Poll;
  isUpdated: Boolean;
  createdAt: Date;
  isLiked: Boolean;
}

export default PostList;
