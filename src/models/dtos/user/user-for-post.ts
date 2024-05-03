import mongoose from "mongoose";

export type UserForPost = {
  _id: mongoose.Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  university: string;
  department: string;
  profilePicture: string;
  followers: mongoose.Schema.Types.ObjectId[];
};
