import mongoose from "mongoose";
import { CommentDoc } from "../../mongoose/CommentDoc";

interface PostList {
  _id: mongoose.Schema.Types.ObjectId;
  creator: mongoose.Schema.Types.ObjectId;
  content: { caption: string, files: File[]};
  likes: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
  isUpdated: Boolean;
  comments: Array<CommentDoc>;
  type: string;
}

export default PostList;
