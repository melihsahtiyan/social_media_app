import { ObjectId } from "mongoose";

interface PostForCreateDto {
  creator: ObjectId;
  caption: string;
  mediaUrls: string[];
  type: string;
}
export { PostForCreateDto };
