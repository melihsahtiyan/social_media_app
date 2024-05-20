import { Schema } from "mongoose";

export interface EventDetailDto {
  title: string;
  description: string;
  image: string;
  location: string;
  date: Date;
  time: string;
  club: Schema.Types.ObjectId;
  isPublic: boolean;
  isOnline: boolean;
  attendees: {
    _id: Schema.Types.ObjectId;
    firstName: string;
    lastName: string;
  }[];
  posts: Schema.Types.ObjectId[];
  isUpdated: boolean;
}
