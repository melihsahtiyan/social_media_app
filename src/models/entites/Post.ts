import { Schema } from "mongoose";
import { Entity } from "./Entity";
import { Poll } from "./Poll";
export interface Post extends Entity {
  creator: Schema.Types.ObjectId;
  content: { caption: string; mediaUrls: Array<string> };
  likes: Schema.Types.ObjectId[];
  likeCount: number;
  comments: Schema.Types.ObjectId[];
  commentCount: number;
  poll: Poll;
  event?: Schema.Types.ObjectId;
  isUpdated: boolean;
}
