import { CommentForCreateDto } from "../../models/dtos/comment/comment-for-create";
import { Comment } from "../../models/entites/Comment";

export interface ICommentRepository {
  create(comment: Comment): Promise<Comment>;
  reply(
    commentId: string,
    reply: CommentForCreateDto
  ): Promise<CommentForCreateDto>;
  getById(id: string): Promise<Comment>;
  getCommentsByPostId(postId: string): Promise<Array<Comment>>;
  delete(id: string): Promise<boolean>;
  update(id: string, content: string): Promise<boolean>;
}
