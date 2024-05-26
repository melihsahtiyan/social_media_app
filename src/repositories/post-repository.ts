import "reflect-metadata";
import { injectable } from "inversify";
import { posts, PostDoc } from "../models/schemas/post.schema";
import { UserDoc, users } from "../models/schemas/user.schema";
import { PostDetails } from "../models/dtos/post/post-details";
import { PostForCreate } from "../models/dtos/post/post-for-create";
import mongoose, { Schema } from "mongoose";
import IPostRepository from "../types/repositories/IPostRepository";
import { PostForLike } from "../models/dtos/post/post-for-like";
import { Post } from "../models/entites/Post";
import { UserForPost } from "../models/dtos/user/user-for-post";

@injectable()
export class PostRepository implements IPostRepository {
  constructor() {}

  async createPost(postForCreate: PostForCreate): Promise<PostDoc> {
    const createdPost: PostDoc = await posts.create({ ...postForCreate });

    const creator: UserDoc = await users.findById(createdPost.creator);
    creator.posts.push(createdPost._id);
    await creator.save();

    return createdPost;
  }
  async getAllUniversityPosts(university: string): Promise<Array<Post>> {
    const usersFromUniversity: UserDoc[] = await users.find({
      university: university,
    });

    return await posts
      .find({ creator: { $in: usersFromUniversity.map((user) => user._id) } })
      .populate("creator", "firstName lastName profilePhotoUrl")
      .populate("likes", "firstName lastName profilePhotoUrl")
      .sort({ createdAt: 1 });
  }

  async getAllPosts(pages?: number): Promise<PostDoc[]> {
    return await posts
      .find()
      .populate("creator", "firstName lastName profilePhotoUrl")
      .sort({ createdAt: 1 })
      .limit(pages ? pages : null);
  }
  async getPostsByUserId(
    userId: mongoose.Schema.Types.ObjectId
  ): Promise<PostDoc[]> {
    throw new Error("Method not implemented.");
  }

  async getPostById(id: string): Promise<PostDetails> {
    const post: PostDoc = await posts.findById(id);

    const creator: UserForPost = await users.findById(post.creator);

    const postDetails: PostDetails = {
      _id: post._id,
      creator: {
        ...creator,
      },
      content: {
        caption: post.content.caption,
        mediaUrls: post.content.mediaUrls,
      },
      poll: post.poll,
      likes: post.likes,
      likeCount: post.likeCount,
      comments: post.comments,
      commentCount: post.commentCount,
      createdAt: post.createdAt,
      isUpdated: post.isUpdated,
      isLiked: false,
    };

    return postDetails;
  }
  async getById(postId: string): Promise<PostDoc> {
    return await posts.findById(postId);
  }
  async getPostDetailsById(id: string): Promise<PostDetails> {
    const postDetails: PostDetails = await posts
      .findById(id)
      .populate("creator", "firstName lastName profilePhotoUrl university");
    return postDetails;
  }

  async getFriendsPosts(
    userId: mongoose.Schema.Types.ObjectId
  ): Promise<PostDoc[]> {
    const user: UserDoc = await users.findById(userId);
    const userIds: mongoose.Schema.Types.ObjectId[] = user.friends;

    return await posts
      .find({ creator: { $in: userIds } })
      .populate("creator", "firstName lastName profilePhotoUrl")
      .sort({ createdAt: 1 });
  }

  async updateCaption(id: string, caption: string): Promise<PostDoc> {
    return await posts.findByIdAndUpdate(
      id,
      { "content.caption": caption, isUpdated: true },
      { new: true }
    );
  }
  async updatePost(post: PostDoc): Promise<PostDoc> {
    return await posts.findByIdAndUpdate(
      post._id,
      { ...post, isUpdated: true },
      { new: true }
    );
  }

  async deletePost(id: string): Promise<boolean> {
    const postToDelete: PostDoc = await posts.findById(id);

    const creator: UserDoc = await users.findById(postToDelete.creator);

    creator.posts = creator.posts.filter(
      (postId) => postId.toString() !== id.toString()
    );

    await creator.save();

    const deletedPost = await posts.findByIdAndDelete(id);

    return deletedPost ? true : false;
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
      content: {
        caption: updatedPost.content.caption,
        mediaUrls: updatedPost.content.mediaUrls,
      },
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
      content: {
        caption: post.content.caption,
        mediaUrls: post.content.mediaUrls,
      },
      likes: post.likes,
      likeCount: post.likeCount,
      isUpdated: post.isUpdated,
    };
    return postForLike;
  }
}
