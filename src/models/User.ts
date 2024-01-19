import mongoose from "mongoose";

interface UserDoc extends mongoose.Document {
  firstName: string;
  lastName: string;
  birthDate: Date;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  university: string;
  department: string;
  studentId: string;
  studentEmail: string;
  status: boolean;
  profilePicture: string;
  followers: mongoose.Schema.Types.ObjectId[];
  posts: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
}

interface UserModel extends mongoose.Model<UserDoc> {}

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  passwordSalt: {
    type: String,
    required: true,
  },
  university: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
  },
  studentEmail: {
    type: String,
    required: false,
    unique: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
  profilePicture: {
    type: String,
    required: false,
  },
  followers: [
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
    default: Date.now,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

export default User;

export { UserDoc, UserModel };
