import { ObjectId } from "mongoose";

interface PostForCreateDto {
  creator: ObjectId;
  content: string;
  mediaUrls: string[];
  type: string;
}
export { PostForCreateDto };
