import mongoose from "mongoose";

export type UserForPost = {
  firstName: string;
  lastName: string;
  university: string;
  department: string;
  profilePicture: string;
  followers: mongoose.Schema.Types.ObjectId[];
};
