import * as mongoose from "mongoose";
import jwt from "jsonwebtoken";

interface IUser extends mongoose.Document {
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
  posts: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
  generateJsonWebToken: () => string;
}

interface UserModel extends mongoose.Model<IUser> {}

const userSchema = new mongoose.Schema<IUser>({
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
  password: {
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
  studentEmail: {
    type: String,
    required: false,
  },
  status: {
    type: {
      studentVerification: {
        type: Boolean,
        required: true,
      },
      emailVerification: {
        type: Boolean,
        required: true,
      },
    },
    default: {
      studentVerification: false,
      emailVerification: false,
    },
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

userSchema.methods.generateJsonWebToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
    },
    process.env.SECRET_KEY
  );
  return token;
};

const User = mongoose.model("User", userSchema);

export default User;

export { IUser, UserModel };
