import mongoose from "mongoose";

type CommentModel = {
  creator: mongoose.Schema.Types.ObjectId;
  content: string;
  createdAt: Date;
  isUpdated: Boolean;
  likes: mongoose.Schema.Types.ObjectId[];
  replies: mongoose.Schema.Types.ObjectId[];
};

export type CommentDoc = mongoose.Document & CommentModel;

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
  isUpdated: {
    type: Boolean,
    default: false,
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

const comments: mongoose.Model<CommentDoc> =
  mongoose.models.comments ||
  mongoose.model<CommentDoc>("Comment", commentSchema);

export { comments };
