import { Schema } from "mongoose";

export interface EventListDto {
  title: string;
  description: string;
  image: string;
  location: string;
  date: Date;
  time: string;
  club: { _id: Schema.Types.ObjectId; name: string };
  isPublic: boolean;
  isOnilne: boolean;
  attendeeCount: number;
  isUpdated: boolean;
}
