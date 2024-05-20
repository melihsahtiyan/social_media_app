import { Schema } from "mongoose";
import { Entity } from "./Entity";

export interface Event extends Entity {
  title: string;
  description: string;
  image: string;
  location: string;
  date: Date;
  time: string;
  club: Schema.Types.ObjectId;
  isPublic: boolean;
  isOnilne: boolean;
  attendees: Schema.Types.ObjectId[];
  posts: Schema.Types.ObjectId[];
  isUpdated: boolean;
}
