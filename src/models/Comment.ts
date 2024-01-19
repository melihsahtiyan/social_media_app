import mongoose from "mongoose";

interface CommentDoc extends mongoose.Document {
  creator: mongoose.Schema.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  likes: mongoose.Schema.Types.ObjectId[];
  replies: mongoose.Schema.Types.ObjectId[];
}

interface CommentModel extends mongoose.Model<CommentDoc> {}

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

export default mongoose.model("Comment", commentSchema);

export { CommentDoc, CommentModel };
