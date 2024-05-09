import mongoose from "mongoose";

export type PollDetails = {
  _id: mongoose.Schema.Types.ObjectId;
  creator: mongoose.Schema.Types.ObjectId;
  options: { optionName: Array<String>; totalVotes: Number }[];
  votes: [
    {
      voter: mongoose.Schema.Types.ObjectId;
      option: String;
    }
  ];
  likeCount: Number;
  likes: mongoose.Schema.Types.ObjectId[];
  comments: mongoose.Schema.Types.ObjectId[];
  commentCount: Number;
  totalVotes: Number;
  expiresAt: Date;
  createdAt: Date;
};
