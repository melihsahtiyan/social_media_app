import mongoose from "mongoose";
import { IPost } from "./Post";

interface IPoll extends IPost {
  options: Array<String>;
  votes: [
    {
      voter: mongoose.Schema.Types.ObjectId;
      option: String;
    }
  ];
  totalVotes: Number;
  expiresAt: Date;
  createdAt: Date;
}

interface PollModel extends mongoose.Model<IPoll> {}

const pollSchema = new mongoose.Schema<IPoll>({
  options: [
    {
      type: Array<String>,
      required: true,
    },
  ],
  votes: [
    {
      type: Array<Object>,
      default: [],
    },
  ],
  totalVotes: {
    type: Number,
    default: 0,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});
