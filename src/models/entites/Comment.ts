import { Schema } from "mongoose";
import { Entity } from "./Entity";

export interface Comment extends Entity {
  _id: Schema.Types.ObjectId;
  creator: Schema.Types.ObjectId;
  post: Schema.Types.ObjectId;
  content: string;
  isUpdated: boolean;
  likes: Schema.Types.ObjectId[];
  replies: Schema.Types.ObjectId[];
}
