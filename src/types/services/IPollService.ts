import { PollInputDto } from "src/models/dtos/post/poll/poll-input-dto";
import { PostDoc } from "../../models/schemas/post.schema";
import { DataResult } from "../result/DataResult";
import { Express } from "express";
import { PostDetails } from "src/models/dtos/post/post-details";

export interface IPollService {
  createPoll(
    userId: string,
    poll: PollInputDto,
    files?: Express.Multer.File[]
  ): Promise<DataResult<PostDoc>>;
  votePoll(
    pollId: string,
    userId: string,
    optionId: string
  ): Promise<DataResult<PostDetails>>;

  deleteVote(pollId: string, userId: string): Promise<DataResult<PostDoc>>;

  deletePoll(pollId: string): Promise<DataResult<PostDoc>>;
}
