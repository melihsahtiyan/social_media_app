import { Schema } from "mongoose";

export interface Poll {
  question: string;
  options: Array<{ optionName: string; votes: number }>;
  votes: Array<{
    voter: Schema.Types.ObjectId;
    option: string;
  }>;
  totalVotes: number;
  expiresAt: Date;
}
