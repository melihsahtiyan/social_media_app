import { Schema } from "mongoose";

export interface ClubDetailDto {
  name: string;
  logo: string;
  banner: string;
  biography: string;
  status: boolean;
  president: {
    _id: Schema.Types.ObjectId;
    firstName: string;
    lastName: string;
  };
  organizers: {
    _id: Schema.Types.ObjectId;
    firstName: string;
    lastName: string;
  }[];
  members: {
    _id: Schema.Types.ObjectId;
    firstName: string;
    lastName: string;
  }[];
  posts: Schema.Types.ObjectId[];
  events: Schema.Types.ObjectId[];
}
