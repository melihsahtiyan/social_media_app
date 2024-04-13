import mongoose from "mongoose";

export interface Entity {
  _id: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
