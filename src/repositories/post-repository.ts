import "reflect-metadata";
import { injectable } from "inversify";
import { posts, PostDoc } from "../models/schemas/post.schema";
import { UserDoc, users } from "../models/schemas/user.schema";
import { PostDetails } from "../models/dtos/post/post-details";
import { PostForCreate } from "../models/dtos/post/post-for-create";
import mongoose from "mongoose";
import IPostRepository from "../types/repositories/IPostRepository";
import { PostForLike } from "src/models/dtos/post/post-for-like";

@injectable()
export class PostRepository implements IPostRepository {
  constructor() {}

  async getAllInUniversityPosts(university: string): Promise<PostDoc[]> {
    return await posts
      .find({ "creator.university": university })
      .populate("creator", "firstName lastName profilePicture")
      .sort({ createdAt: -1 });
  }

  async getAllPosts(pages?: number): Promise<PostDoc[]> {
    return await posts
      .find()
      .populate("creator", "firstName lastName profilePicture")
      .sort({ createdAt: -1 })
      .limit(pages ? pages : 10);
  }
  async getPostsByUserId(
    userId: mongoose.Schema.Types.ObjectId
  ): Promise<PostDoc[]> {
    throw new Error("Method not implemented.");
  }

  async getPostById(id: string): Promise<PostDoc | null> {
    return (await posts
      .findById(id)
      .populate("creator", "firstName lastName profilePicture")) as PostDoc;
  }

  async getPostDetailsById(id: string): Promise<PostDetails> {
    const postDetails: PostDetails = await posts
      .findById(id)
      .populate("creator", "firstName lastName profilePicture university");
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

  async updatePost(id: string, caption: string): Promise<PostDoc> {
    return await posts.findByIdAndUpdate(
      id,
      { "content.caption": caption, isUpdated: true },
      { new: true }
    );
  }

  async deletePost(id: string): Promise<PostDoc> {
    return await posts.findByIdAndDelete(id);
  }

  async likePost(
    postId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId
  ): Promise<PostForLike> {
    const post: PostDoc = await posts.findById(postId);

    if (post.likes.includes(userId)) {
      return await this.unlikePost(postId, userId);
    }

    post.likes.push(userId);
    post.likeCount = post.likes.length;

    const updatedPost: PostDoc = await post.save();

    const postForLike: PostForLike = {
      _id: updatedPost._id,
      creator: updatedPost.creator,
      caption: updatedPost.content.caption,
      likes: updatedPost.likes,
      likeCount: updatedPost.likeCount,
      isUpdated: updatedPost.isUpdated,
    };
    return postForLike;
  }
  async unlikePost(
    postId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId
  ): Promise<PostForLike> {
    const post: PostDoc = await posts.findById(postId);

    post.likes = post.likes.filter(
      (like) => like.toString() !== userId.toString()
    );

    post.likeCount = post.likes.length;

    await post.save();

    const postForLike: PostForLike = {
      _id: post._id,
      creator: post.creator,
      caption: post.content.caption,
      likes: post.likes,
      likeCount: post.likeCount,
      isUpdated: post.isUpdated,
    };
    return postForLike;
  }
}
