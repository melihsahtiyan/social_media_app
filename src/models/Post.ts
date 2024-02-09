import mongoose, { ObjectId } from "mongoose";

interface IPost extends mongoose.Document {
  creator: mongoose.Schema.Types.ObjectId;
  content: string;
  mediaUrls: Array<String>;
  likes: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
  comments: Array<ObjectId>;
  type: string;
  updatedAt: Date;
}

interface PostModel extends mongoose.Model<IPost> {}

const postSchema = new mongoose.Schema<IPost>({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
  },
  mediaUrls: [
    {
      type: String,
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  type: {
    type: String,
    required: true,
    Enum: ["normal", "poll"],
  },
  updatedAt: {
    type: Date,
    default: null,
  },
});

export default mongoose.model("Post", postSchema);

export { IPost, PostModel };
