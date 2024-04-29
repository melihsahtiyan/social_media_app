import mongoose from "mongoose";
import { Entity } from "./Entity";

export interface User extends Entity {
  firstName: string;
  lastName: string;
  birthDate: Date;
  email: string;
  password: string;
  university: string;
  department: string;
  studentEmail: string;
  status: {
    studentVerification: boolean;
    emailVerification: boolean;
  };
  profilePicture: string;
  friends: mongoose.Schema.Types.ObjectId[];
  friendRequests: mongoose.Schema.Types.ObjectId[];
  posts: mongoose.Schema.Types.ObjectId[];
}
