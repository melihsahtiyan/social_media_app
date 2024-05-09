import mongoose from "mongoose";

export type UserForPost = {
  _id: mongoose.Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  university: string;
  department: string;
  profilePicture: string;
  friends: mongoose.Schema.Types.ObjectId[];
};
