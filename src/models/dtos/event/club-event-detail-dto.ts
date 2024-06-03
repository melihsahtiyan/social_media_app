import { Schema } from "mongoose";

export interface ClubEventDetailDto {
  title: string;
  description: string;
  image: string;
  location: string;
  date: Date;
  time: string;
  club: { _id: Schema.Types.ObjectId; name: string };
  organizer: {
    _id: Schema.Types.ObjectId;
    firstName: string;
    lastName: string;
  };
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
