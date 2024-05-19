import { Schema } from "mongoose";

export interface ClubForCreate {
  name: String;
  logoUrl: String;
  bannerUrl: String;
  biography: String;
  status: boolean;
  president: Schema.Types.ObjectId;
  organizers: Schema.Types.ObjectId[];
  members: Schema.Types.ObjectId[];
}
