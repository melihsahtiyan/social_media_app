import mongoose from "mongoose";

export type CommentForCreate = {
  creator: mongoose.Schema.Types.ObjectId;
  postId: mongoose.Schema.Types.ObjectId;
  content: string;
};
