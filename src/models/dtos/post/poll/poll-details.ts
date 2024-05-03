import mongoose from "mongoose";
import { UserForPost } from "../../user/user-for-post";

export type PollDetails = {
  _id: mongoose.Schema.Types.ObjectId;
  creator: UserForPost;
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
