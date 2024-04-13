import mongoose from "mongoose";
import { Post } from "./Post";

export interface Poll extends Post {
  question: String;
  options: { optionName: Array<String>; totalVotes: Number }[];
  votes: [
    {
      voter: mongoose.Schema.Types.ObjectId;
      option: String;
    }
  ];
  totalVotes: Number;
  expiresAt: Date;
}
