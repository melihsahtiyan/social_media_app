import mongoose, { ObjectId } from "mongoose";

interface PostDoc extends mongoose.Document {
  creator: mongoose.Schema.Types.ObjectId;
  content: string;
  mediaUrls: string[];
  likes: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
  comments: mongoose.Schema.Types.ObjectId[];
  type: string;
}

interface PostModel extends mongoose.Model<PostDoc> {}

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

export default mongoose.model("Post", postSchema);

export { PostDoc, PostModel };

// import { ObjectId } from "mongoose";
// import { Schema, model } from "ottoman";

// const schema = new Schema({
//   creator: {
//     type: String,
//     required: true,
//   },
//   content: {
//     type: String,
//   },
//   mediaUrls: {
//     type: Array<String>,
//     default: [],
//   },
//   likes: {
//     type: Array<String>,
//     default: [],
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//     required: true,
//   },
//   comments: {
//     type: Array<ObjectId>,
//     ref: "Comment",
//     default: [],
//   },
//   type: {
//     type: String,
//     required: true,
//   },
//   status: { type: String, enum: ["Close", "Open", "Review"] },
// });

// const Post = model("Post", schema);

// export default Post;
