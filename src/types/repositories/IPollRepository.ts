import { Schema } from "mongoose";
import { Post } from "../../models/entites/Post";
import { PostDoc } from "../../models/schemas/post.schema";
import { Poll } from "../../models/entites/Poll";

export interface IPollRepository {
  createPoll(poll: Poll): Promise<Post>;
  votePoll(
    pollId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    option: string
  ): Promise<PostDoc>;

  deleteVote(
    pollId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    option: string
  ): Promise<PostDoc>;

  deletePoll(pollId: Schema.Types.ObjectId): Promise<PostDoc>;
}
