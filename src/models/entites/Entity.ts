import mongoose from "mongoose";

export class Entity {
  _id: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
