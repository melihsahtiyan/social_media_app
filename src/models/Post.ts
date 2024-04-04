import mongoose from "mongoose";
import { UserDoc } from "./User";
import { CommentDoc } from "./Comment";

export type PostModel = {
  creator: UserDoc;
  content: { caption: string; mediaUrls: Array<string> };
  likes: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
  comments: Array<CommentDoc>;
  type: string;
  isUpdated: Boolean;
};

export type PostDoc = mongoose.Document & PostModel;

const postSchema = new mongoose.Schema({
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
    Enum: ["normal", "poll"],
  },
  isUpdated: {
    type: Boolean,
    default: false,
  },
});

const posts: mongoose.Model<PostDoc> =
  mongoose.models.posts || mongoose.model<PostDoc>("posts", postSchema);

export { posts };
