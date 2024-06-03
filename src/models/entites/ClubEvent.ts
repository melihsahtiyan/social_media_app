import { Schema } from "mongoose";
import { Entity } from "./Entity";

export interface ClubEvent extends Entity {
  title: string;
  description: string;
  image: string;
  location: string;
  date: Date;
  time: string;
  club: Schema.Types.ObjectId;
  organizer: Schema.Types.ObjectId;
  isPublic: boolean;
  isOnline: boolean;
  attendees: Schema.Types.ObjectId[];
  posts: Schema.Types.ObjectId[];
  isUpdated: boolean;
}
