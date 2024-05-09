import { CommentDoc, comments } from "../models/schemas/comment.schema";
import { CommentForCreate } from "../models/dtos/comment/comment-for-create";
import { Comment } from "src/models/entites/Comment";

export class CommentRepository {
  constructor() {}

  async createComment({
    creator,
    postId,
    content,
  }: CommentForCreate): Promise<Comment> {
    return await comments.create({
      creator,
      postId,
      content,
    });
  }

  async getCommentById(id: string): Promise<CommentDoc | null> {
    return (await comments.findById(id)) as CommentDoc;
  }

  async getCommentsByPostId(postId: string): Promise<CommentDoc[]> {
    return await comments.find({ postId });
  }

  async deleteComment(id: string): Promise<CommentDoc | null> {
    return await comments.findByIdAndDelete(id);
  }

  async updateComment(id: string, content: string): Promise<CommentDoc | null> {
    return await comments.findByIdAndUpdate(id, { content }, { new: true });
  }
}
