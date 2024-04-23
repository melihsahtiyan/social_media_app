import mongoose from "mongoose";
import { CommentDoc } from "../../schemas/comment.schema";

interface PostList {
  _id: mongoose.Schema.Types.ObjectId;
  creator: mongoose.Schema.Types.ObjectId;
  content: { caption: string, files: string[]};
  likes: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
  isUpdated: Boolean;
  comments: Array<CommentDoc>;
  type: string;
}

export default PostList;
