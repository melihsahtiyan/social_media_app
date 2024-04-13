import mongoose from "mongoose";
import { Post } from "../entites/Post";


export type PostDoc = mongoose.Document & Post;

export const postSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  content: {
    caption: String,
    mediaUrls: Array<String>,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  type: {
    type: String,
    Enum: ["post", "poll"],
  },
  isUpdated: {
    type: Boolean,
    default: false,
  },
});

const posts: mongoose.Model<PostDoc> =
  mongoose.models.posts || mongoose.model<PostDoc>("posts", postSchema);

export { posts };
