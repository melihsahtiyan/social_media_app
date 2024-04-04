import mongoose from "mongoose";

export type UserForUpdate = {
  password: string;
  studentEmail: string;
  profilePicture: string;
  followers: mongoose.Schema.Types.ObjectId[];
  followRequests: mongoose.Schema.Types.ObjectId[];
  following: mongoose.Schema.Types.ObjectId[];
  posts: mongoose.Schema.Types.ObjectId[];
};
