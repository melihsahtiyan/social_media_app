import { Schema } from "mongoose";

export interface UserForSearchDto {
  _id: Schema.Types.ObjectId;
  fullName: string;
  profilePhotoUrl: string;
  isFriend: boolean;
}
