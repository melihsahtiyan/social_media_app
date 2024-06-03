import { Schema } from "mongoose";

export interface ClubEventForCreate {
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
}
