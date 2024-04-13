import mongoose from "mongoose";
import { Entity } from "./Entity";

export interface Comment extends Entity {
  creator: mongoose.Schema.Types.ObjectId;
  content: string;
  isUpdated: Boolean;
  likes: mongoose.Schema.Types.ObjectId[];
  replies: mongoose.Schema.Types.ObjectId[];
}
