import mongoose from "mongoose";

interface ClubDoc extends mongoose.Document {
  name: string;
  logoUrl: string;
  bannerUrl: string;
  biography: string;
  status: boolean;
  president: mongoose.Schema.Types.ObjectId;
  organizers: mongoose.Schema.Types.ObjectId[];
  members: mongoose.Schema.Types.ObjectId[];
  posts: mongoose.Schema.Types.ObjectId[];
  events: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
}

interface ClubModel extends mongoose.Model<ClubDoc> {}

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  logoUrl: {
    type: String,
    required: false,
  },
  bannerUrl: {
    type: String,
    required: false,
  },
  biography: {
    type: String,
    required: false,
  },
  status: {
    type: Boolean,
    default: true,
  },
  president: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  organizers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  members: [
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
  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export default mongoose.model("Club", clubSchema);

export { ClubDoc, ClubModel };
