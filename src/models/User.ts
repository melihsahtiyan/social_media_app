import * as mongoose from "mongoose";

type UserModel = {
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
  createdAt: Date;
};

export type UserDoc = mongoose.Document & UserModel;

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  birthDate: Date,
  email: String,
  password: String,
  university: String,
  department: String,
  studentEmail: String,
  status: {
    type: {
      studentVerification: Boolean,
      emailVerification: Boolean,
    },
    default: {
      studentVerification: false,
      emailVerification: false,
    },
  },
  profilePicture: {
    type: String,
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  followRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const users: mongoose.Model<UserDoc> = 
  mongoose.models.users || mongoose.model<UserDoc>("User", userSchema);

export { users };
