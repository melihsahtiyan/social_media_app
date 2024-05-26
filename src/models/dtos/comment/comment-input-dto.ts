import mongoose from "mongoose";

export type CommentInputDto = {
  creator: mongoose.Schema.Types.ObjectId;
  postId: mongoose.Schema.Types.ObjectId;
  content: string;
};
