import mongoose from "mongoose";
import { posts, PostModel } from "./Post";

type PollModel = PostModel & {
  options: { optionName: Array<String>; totalVotes: Number }[];
  votes: [
    {
      voter: mongoose.Schema.Types.ObjectId;
      option: String;
    }
  ];
  totalVotes: Number;
  expiresAt: Date;
  createdAt: Date;
};

export type PollDoc = mongoose.Document & PollModel;

const pollSchema = new mongoose.Schema<PollDoc>(
  {
    ...posts,
    options: [
      {
        optionName: String,
        totalVotes: { type: Number, default: 0, min: 0 },
      },
    ],
    votes: [
      {
        voter: {
          type: Array<Object>,
        },
        option: {
          type: String,
        },
      },
    ],
    totalVotes: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { discriminatorKey: "type" }
);

const polls: mongoose.Model<PollDoc> =
  mongoose.models.polls || mongoose.model<PollDoc>("polls", pollSchema);

export { polls };
