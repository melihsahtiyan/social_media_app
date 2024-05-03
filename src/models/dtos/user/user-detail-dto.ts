import mongoose from "mongoose";

export interface UserDetailDto {
  _id: mongoose.Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  friends: Array<{
    _id: string;
    firstName: string;
    lastName: string;
  }>;
  friendCount: number;
  friendRequests: Array<{
    _id: string;
    firstName: string;
    lastName: string;
  }>;
  posts: Array<string>;
  createdAt: Date;
  updatedAt: Date;
}
