import mongoose from "mongoose";
import { Club } from "../entites/Club";

export type ClubDoc = mongoose.Document & Club;

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  logo: {
    type: String,
  },
  banner: {
    type: String,
  },
  biography: {
    type: String,
  },
  status: {
    type: Boolean,
    default: true,
  },
  president: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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

const clubs: mongoose.Model<ClubDoc> =
  mongoose.models.clubs || mongoose.model<ClubDoc>("Club", clubSchema);

export { clubs };
