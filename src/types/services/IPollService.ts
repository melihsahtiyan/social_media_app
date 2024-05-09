import { VoteInputDto } from "src/models/dtos/post/poll/vote-input-dto";
import { PollInputDto } from "../../models/dtos/post/poll/poll-input-dto";
import { PostDoc } from "../../models/schemas/post.schema";
import { DataResult } from "../result/DataResult";
import { Express } from "express";
import { Poll } from "src/models/entites/Poll";

export interface IPollService {
  createPoll(
    userId: string,
    poll: PollInputDto,
    files?: Express.Multer.File[]
  ): Promise<DataResult<PollInputDto>>;
  votePoll(voteInput: VoteInputDto): Promise<DataResult<VoteInputDto>>;

  deleteVote(pollId: string, userId: string): Promise<DataResult<Poll>>;

  deletePoll(pollId: string): Promise<DataResult<PostDoc>>;
}
