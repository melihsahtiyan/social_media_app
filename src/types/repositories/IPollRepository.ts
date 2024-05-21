import { Schema } from "mongoose";
import { PollCreate } from "../../models/dtos/post/poll/poll-create-dto";
import { Post } from "../../models/entites/Post";
import { PostDoc } from "../../models/schemas/post.schema";

export interface IPollRepository {
  createPoll(poll: PollCreate): Promise<Post>;
  votePoll(
    pollId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    option: string
  ): Promise<PostDoc>;

  deleteVote(
    pollId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId
  ): Promise<PostDoc>;

  deletePoll(pollId: Schema.Types.ObjectId): Promise<PostDoc>;
}
