import { Schema } from "mongoose";
import { Entity } from "./Entity";

export interface Club extends Entity {
  name: string;
  logo: string;
  banner: string;
  biography: string;
  status: boolean;
  president: Schema.Types.ObjectId;
  organizers: Schema.Types.ObjectId[];
  members: Schema.Types.ObjectId[];
  posts: Schema.Types.ObjectId[];
  events: Schema.Types.ObjectId[];
}
