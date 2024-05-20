import { Schema } from "mongoose";

export interface EventForCreate {
  title: string;
  description: string;
  image: string;
  location: string;
  date: Date;
  time: string;
  club: Schema.Types.ObjectId;
  isPublic: boolean;
  isOnilne: boolean;
}
