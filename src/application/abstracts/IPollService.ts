import { VoteInputDto } from '../../models/dtos/post/poll/vote-input-dto';
import { PollInputDto } from '../../models/dtos/post/poll/poll-input-dto';
import { DataResult } from '../../types/result/DataResult';
import { Result } from '../../types/result/Result';

export interface IPollService {
	createPoll(userId: string, poll: PollInputDto, files?: Express.Multer.File[]): Promise<DataResult<PollInputDto>>;
	votePoll(voteInput: VoteInputDto): Promise<DataResult<VoteInputDto>>;

	deleteVote(pollId: string, userId: string): Promise<Result>;

	// deletePoll(pollId: string): Promise<DataResult<PostDoc>>;
}
