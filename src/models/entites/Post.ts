import mongoose from "mongoose";
import { Entity } from "./Entity";
import { CommentDoc } from "../schemas/comment.schema";
export interface Post extends Entity {
  creator: mongoose.Schema.Types.ObjectId;
  content: { caption: string; mediaUrls: Array<string> };
  likes: mongoose.Schema.Types.ObjectId[];
  likeCount: number;
  comments: Array<CommentDoc>;
  commentCount: number;
  type: string;
  isUpdated: Boolean;
}
