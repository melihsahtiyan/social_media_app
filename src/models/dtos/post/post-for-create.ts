import mongoose from "mongoose";

export interface PostForCreate {
  creator: mongoose.Types.ObjectId;
  content: { caption: string; mediaUrls: Array<string> };
  type: string;
}
