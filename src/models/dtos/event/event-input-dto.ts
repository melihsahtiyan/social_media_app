import { Schema } from "mongoose";

export interface EventInputDto {
  title: string;
  description: string;
  location: string;
  date: Date;
  time: string;
  club: Schema.Types.ObjectId;
  isPublic: boolean;
  isOnilne: boolean;
}
