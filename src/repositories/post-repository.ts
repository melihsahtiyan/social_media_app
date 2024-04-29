import "reflect-metadata";
import { injectable } from "inversify";
import { posts, PostDoc } from "../models/schemas/post.schema";
import { UserDoc, users } from "../models/schemas/user.schema";
import { PostDetails } from "../models/dtos/post/post-details";
import { PostForCreate } from "../models/dtos/post/post-for-create";
import { UserForPost } from "../models/dtos/user/user-for-post";
import mongoose from "mongoose";
import IPostRepository from "../types/repositories/IPostRepository";

@injectable()
export class PostRepository implements IPostRepository {
  constructor() {}

  async createPost({
    creator,
    content: { caption, mediaUrls },
    type,
  }: PostForCreate): Promise<PostDoc> {
    const postForCreate: PostForCreate = {
      creator,
      content: {
        caption,
        mediaUrls,
      },
      type,
    };

    return await posts.create({ ...postForCreate });
  }

  async getAllPosts(pages?: number): Promise<PostDoc[]> {
    return await posts
      .find()
      .populate("creator", "firstName lastName profilePicture")
      .sort({ createdAt: -1 })
      .limit(pages ? pages : 10);
  }

  async getPostById(id: string): Promise<PostDoc | null> {
    return (await posts
      .findById(id)
      .populate("creator", "firstName lastName profilePicture")) as PostDoc;
  }

  async getPostDetails(id: string): Promise<PostDetails> {
    const postDetails: PostDetails = await posts
      .findById(id)
      .populate("creator", "firstName lastName profilePicture");

    return postDetails;
  }

  async getFriendsPosts(
    userId: mongoose.Schema.Types.ObjectId
  ): Promise<PostDoc[]> {
    const user: UserDoc = await users.findById(userId);
    const userIds: mongoose.Schema.Types.ObjectId[] = user.friends;

    return await posts
      .find({ creator: { $in: userIds } })
      .populate("creator", "firstName lastName profilePicture")
      .sort({ createdAt: -1 });
  }

  async deletePost(id: string): Promise<PostDoc> {
    return await posts.findByIdAndDelete(id);
  }

  async updatePost(id: string, caption: string): Promise<PostDoc> {
    return await posts.findByIdAndUpdate(
      id,
      { "content.caption": caption, isUpdated: true },
      { new: true }
    );
  }
}
