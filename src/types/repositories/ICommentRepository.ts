import { Comment } from "../../models/entities/Comment";

export interface ICommentRepository {
  create(comment: Comment): Promise<Comment>;
  reply(
    commentId: string,
    reply: Comment
  ): Promise<Comment>;
  getById(id: string): Promise<Comment>;
  getCommentsByPostId(postId: string): Promise<Array<Comment>>;
  delete(id: string): Promise<boolean>;
  update(id: string, content: string): Promise<boolean>;
}
