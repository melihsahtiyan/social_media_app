import mongoose from "mongoose";

export interface PostForLike {
  _id: mongoose.Schema.Types.ObjectId;
  creator: mongoose.Schema.Types.ObjectId;
  caption: string;
  likes: mongoose.Schema.Types.ObjectId[];
  likeCount: number;
  isUpdated: Boolean;
}
