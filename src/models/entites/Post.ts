import mongoose from "mongoose";
import { Entity } from "./Entity";
import { CommentDoc } from "../mongoose/CommentDoc";
import { UserDoc } from "../mongoose/UserDoc";

export interface Post extends Entity {
  creator: UserDoc;
  content: { caption: string; mediaUrls: Array<string> };
  likes: mongoose.Schema.Types.ObjectId[];
  comments: Array<CommentDoc>;
  type: string;
  isUpdated: Boolean;
}
