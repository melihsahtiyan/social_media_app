import mongoose from "mongoose";
import { PostDetails } from "../post/post-details";

export interface UserDetailDto {
  _id: mongoose.Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  profilePhotoUrl: string;
  university: string;
  department: string;
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
  posts: Array<PostDetails>;
  createdAt: Date;
  updatedAt: Date;
}
