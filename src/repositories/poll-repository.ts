import { PollDoc, polls } from "../models/mongoose/PollDoc";
import { PollDetails } from "../models/dtos/post/poll/poll-details";
import { PollForCreate } from "../models/dtos/post/poll/poll-for-create";
import { PageableModel } from "../types/pageable-model";

export class PollRepository {
  constructor() {}

  async createPoll({
    creator,
    options,
    expiresAt,
    content,
    type,
  }: PollForCreate): Promise<PollDoc> {
    return await polls.create({
      creator,
      options,
      expiresAt,
      content,
      votes: [],
      totalVotes: 0,
      type,
      isUpdated: false,
      likes: [],
      createdAt: new Date(Date.now()),
    });
  }

  async getAllPolls(pageable: PageableModel): Promise<PollDoc[]> {
    return await polls
      .find()
      .skip((pageable.page - 1) * pageable.pageSize)
      .limit(pageable.pageSize);
  }

  async getPollById(id: string): Promise<PollDoc | null> {
    return (await polls.findById(id)) as PollDoc;
  }

  async getPollDetails(id: string): Promise<PollDetails> {
    const pollForDetail: PollDoc = (await polls.findById(id)) as PollDoc;
    const pollDetails: PollDetails = {
      _id: pollForDetail._id,
      creator: pollForDetail.creator,
      options: pollForDetail.options,
      votes: pollForDetail.votes,
      totalVotes: pollForDetail.totalVotes,
      expiresAt: pollForDetail.expiresAt,
      createdAt: pollForDetail.createdAt,
    };

    return pollDetails;
  }

  async deletePoll(id: string): Promise<PollDoc> {
    return await polls.findByIdAndDelete(id);
  }
}
