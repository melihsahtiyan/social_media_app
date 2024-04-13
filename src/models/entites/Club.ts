import mongoose from "mongoose";
import { Entity } from "./Entity";

export interface Club extends Entity {
  name: String;
  logoUrl: String;
  bannerUrl: String;
  biography: String;
  status: boolean;
  president: mongoose.Schema.Types.ObjectId;
  organizers: mongoose.Schema.Types.ObjectId[];
  members: mongoose.Schema.Types.ObjectId[];
  posts: mongoose.Schema.Types.ObjectId[];
  events: mongoose.Schema.Types.ObjectId[];
}
