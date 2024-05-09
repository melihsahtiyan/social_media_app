import { IPollRepository } from "../types/repositories/IPollRepository";
import { Schema } from "mongoose";
import { PostDoc, posts } from "../models/schemas/post.schema";
import { injectable } from "inversify";
import { PollCreate } from "../models/dtos/post/poll/poll-create-dto";
import { Post } from "../models/entites/Post";

@injectable()
export class PollRepository implements IPollRepository {
  constructor() {}

  async createPoll(poll: PollCreate): Promise<Post> {
    return await posts.create(poll);
  }
  async votePoll(
    pollId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    option: string
  ): Promise<PostDoc> {
    const post: PostDoc = await posts.findById(pollId);

    const poll = post.poll;
    const optionIndex: number = poll.options.findIndex(
      (opt) => opt.optionName === option
    );

    poll.options[optionIndex].votes += 1;
    poll.votes.push({ voter: userId, option: option });

    poll.totalVotes += 1;

    post.poll = poll;

    return await post.save();
  }
  async deleteVote(
    pollId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId
  ): Promise<PostDoc> {
    const post: PostDoc = await posts.findById(pollId);

    const poll = post.poll;

    const voteIndex: number = poll.votes.findIndex(
      (vote) => vote.voter.toString() === userId.toString()
    );

    const optionIndex: number = poll.options.findIndex(
      (opt) => opt.optionName === poll.votes[voteIndex].option
    );

    poll.options[optionIndex].votes -= 1;
    poll.votes.splice(voteIndex, 1);

    poll.totalVotes -= 1;

    post.poll = poll;

    return await post.save();
  }
  async deletePoll(pollId: Schema.Types.ObjectId): Promise<PostDoc> {
    return await posts.findByIdAndDelete(pollId);
  }
}
