import { Schema } from "mongoose";
import { Poll } from "../../../models/entites/Poll";

export interface PostForCreate {
  creator: Schema.Types.ObjectId;
  content: { caption: string; mediaUrls: Array<string> };
  poll: Poll;
}
