import { CommentDoc, comments } from "../models/schemas/comment.schema";
import { Comment } from "../models/entites/Comment";
import { ICommentRepository } from "../types/repositories/ICommentRepository";
import { injectable } from "inversify";
import { CommentForCreateDto } from "../models/dtos/comment/comment-for-create";

@injectable()
export class CommentRepository implements ICommentRepository {
  constructor() {}

  async create(comment: CommentForCreateDto): Promise<CommentForCreateDto> {
    const commentForCreate = await comments.create(comment);

    return comment;
  }

  async reply(
    commentId: string,
    reply: CommentForCreateDto
  ): Promise<CommentForCreateDto> {
    const comment = await comments.findById(commentId);

    reply.post = null;
    const createdReply = await comments.create(reply);

    comment.replies.push(createdReply._id);

    return await comment.save();
  }

  async getById(id: string): Promise<CommentDoc> {
    return (await comments.findById(id)) as CommentDoc;
  }

  async getCommentsByPostId(postId: string): Promise<Array<Comment>> {
    const postComments: Array<Comment> = await comments
      .find({ post: postId })
      .populate("creator", "_id firstName lastName profilePhotoUrl")
      .populate("likes", "_id firstName lastName profilePhotoUrl")
      .populate("replies", "_id content creator likes createdAt");

    return postComments;

    // const commentsList: CommentForListDto[] = await Promise.all(
    //   postComments.map(async (comment) => {
    //     const creator = await users.findById(comment.creator);
    //     const likes = await users.find({ _id: { $in: comment.likes } });
    //     const commentForList: CommentForListDto = {
    //       _id: comment._id,
    //       creator: {
    //         _id: creator._id,
    //         firstName: creator.firstName,
    //         lastName: creator.lastName,
    //         profilePicture: creator.profilePhotoUrl,
    //       },
    //       content: comment.content,
    //       isUpdated: comment.isUpdated,
    //       likes: likes.map((like) => {
    //         return {
    //           _id: like._id,
    //           firstName: like.firstName,
    //           lastName: like.lastName,
    //         };
    //       }),
    //       likeCount: comment.likes.length,
    //       createdAt: comment.createdAt,
    //       replies: [],
    //     };

    //     return commentForList;
    //   })
    // );
  }

  async delete(id: string): Promise<boolean> {
    const deletedComment = await comments.findByIdAndDelete(id);

    return !!deletedComment;
  }

  async update(id: string, content: string): Promise<boolean> {
    return await comments.findByIdAndUpdate(id, { content }, { new: true });
  }
}
