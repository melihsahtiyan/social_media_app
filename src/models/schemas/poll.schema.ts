import mongoose from "mongoose";
import { postSchema } from "./post.schema";
import { Poll } from "../entites/Poll";

export type PollDoc = mongoose.Document & Poll;

const pollSchema = new mongoose.Schema<PollDoc>(
  {
    ...postSchema,
    question: {
      type: String,
    },
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
