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
  followers: mongoose.Schema.Types.ObjectId[];
  followRequests: mongoose.Schema.Types.ObjectId[];
  following: mongoose.Schema.Types.ObjectId[];
  posts: mongoose.Schema.Types.ObjectId[];
}
