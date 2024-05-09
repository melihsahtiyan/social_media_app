import mongoose from "mongoose";

export interface PostForCreate {
  creator: mongoose.Schema.Types.ObjectId;
  content: { caption: string; mediaUrls: Array<string> };
  poll: {
    question: string;
    options: Array<{ optionName: string; votes: number }>;
    expiresAt: Date;
  };
}
