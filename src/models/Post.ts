import mongoose, { ObjectId } from "mongoose";

const postSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
  },
  mediaUrls: {
    type: Array<String>,
    default: [],
  },
  likes: {
    type: Array<mongoose.Schema.Types.ObjectId>,
    ref: "User",
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  comments: {
    type: Array<ObjectId>,
    ref: "Comment",
    default: [],
  },
  type: {
    type: String,
    required: true,
  },
});
