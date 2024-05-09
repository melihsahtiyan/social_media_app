import { Schema } from "mongoose";
import { PollCreate } from "src/models/dtos/post/poll/poll-create-dto";
import { Post } from "src/models/entites/Post";
import { PostDoc } from "src/models/schemas/post.schema";

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
