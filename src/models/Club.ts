import mongoose from "mongoose";

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
