import mongoose from "mongoose";
import { Entity } from "./Entity";
import { Poll } from "./Poll";
export interface Post extends Entity {
  creator: mongoose.Schema.Types.ObjectId;
  content: { caption: string; mediaUrls: Array<string> };
  likes: mongoose.Schema.Types.ObjectId[];
  likeCount: number;
  comments: mongoose.Schema.Types.ObjectId[];
  commentCount: number;
  poll: Poll;
  isUpdated: boolean;
}
