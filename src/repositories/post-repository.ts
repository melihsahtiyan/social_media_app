import { posts, PostDoc } from "../models/mongoose/PostDoc";
import { UserDoc, users } from "../models/mongoose/UserDoc";
import { PostDetails } from "../models/dtos/post/post-details";
import { PostForCreate } from "../models/dtos/post/post-for-create";
import { UserForPost } from "../models/dtos/user/user-for-post";
import mongoose from "mongoose";
import { ObjectId } from "mongoose";

export class PostRepository {
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
    return await posts.create(postForCreate);
  }

  async getAllPosts(pages?: number): Promise<PostDoc[]> {
    return await posts.find().limit(pages ? pages : 10);
  }

  async getPostById(id: string): Promise<PostDoc | null> {
    return (await posts.findById(id)) as PostDoc;
  }

  async getPostDetails(id: string): Promise<PostDetails> {
    const postForDetail: PostDoc = (await posts.findById(id)) as PostDoc;
    const postDetails: PostDetails = {
      _id: postForDetail._id,
      creator: {
        ...(postForDetail.creator as UserForPost),
      },
      content: {
        caption: postForDetail.content.caption,
        mediaUrls: postForDetail.content.mediaUrls,
      },
      type: postForDetail.type,
      likes: postForDetail.likes,
      comments: postForDetail.comments,
      createdAt: postForDetail.createdAt,
      isUpdated: postForDetail.isUpdated,
    };

    return postDetails;
  }

  async getFollowingPosts(
    userId: mongoose.Schema.Types.ObjectId
  ): Promise<PostDoc[]> {
    const user: UserDoc = await users.findById(userId);
    const userIds: mongoose.Schema.Types.ObjectId[] = user.following;

    return await posts
      .find({ creator: { $in: userIds } })
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
