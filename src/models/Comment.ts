import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
  likes: {
    type: Array<mongoose.Schema.Types.ObjectId>,
    ref: "User",
    default: [],
  },
  replies: {
    type: Array<mongoose.Schema.Types.ObjectId>,
    ref: "Comment",
    default: [],
  },
});
