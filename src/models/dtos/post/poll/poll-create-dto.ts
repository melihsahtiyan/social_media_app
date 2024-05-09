import { Schema } from "mongoose";

export type PollCreate = {
  creator: Schema.Types.ObjectId;
  caption: string;
  question: string;
  options: { optionName: string; votes: number }[];
  expiresAt: Date;
  content: { caption: string; mediaUrls: Array<string> };
};
