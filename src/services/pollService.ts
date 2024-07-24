import { inject, injectable } from "inversify";
import { PollRepository } from "../repositories/poll-repository";
import { IPollService } from "../types/services/IPollService";
import { PostDoc } from "../models/schemas/post.schema";
import { PostRepository } from "../repositories/post-repository";
import { UserRepository } from "../repositories/user-repository";
import { UserDoc } from "../models/schemas/user.schema";
import { DataResult } from "../types/result/DataResult";
import { PollInputDto } from "../models/dtos/post/poll/poll-input-dto";
import { PostForCreate } from "../models/dtos/post/post-for-create";
import { Poll } from "../models/entites/Poll";
import { CustomError } from "../types/error/CustomError";
import { PostDetails } from "../models/dtos/post/post-details";
import { VoteInputDto } from "../models/dtos/post/poll/vote-input-dto";
import { User } from "../models/entites/User";
import { Post } from "../models/entites/Post";
import { Schema } from "mongoose";

@injectable()
export class PollService implements IPollService {
  private pollRepository: PollRepository;
  private postRepository: PostRepository;
  private userRepository: UserRepository;
  constructor(
    @inject(PollRepository) pollRepository: PollRepository,
    @inject(PostRepository) postRepository: PostRepository,
    @inject(UserRepository) userRepository: UserRepository
  ) {
    this.pollRepository = pollRepository;
    this.postRepository = postRepository;
    this.userRepository = userRepository;
  }

  async createPoll(
    userId: string,
    poll: PollInputDto,
    files?: Express.Multer.File[]
  ): Promise<DataResult<PollInputDto>> {
    try {
      const user: User = await this.userRepository.getById(userId);

      if (!user) {
        const result: DataResult<PollInputDto> = {
          statusCode: 404,
          message: "User not found!",
          success: false,
          data: null,
        };
        return result;
      }

      // TODO: Uncomment this block after implementing student verification
      // if (user.status.studentVerification === false) {
      //   const result: DataResult<PostDoc> = {
      //     statusCode: 403,
      //     message: "You are not authorized to create a poll!",
      //     success: false,
      //     data: null,
      //   };
      //   return result;
      // }

      const options: Array<{
        optionName: string;
        votes: Schema.Types.ObjectId[];
      }> = poll.options.map((option) => {
        return {
          optionName: option,
          votes: [],
        };
      });

      const pollToCreate: Poll = new Poll(
        poll.question,
        options,
        0,
        poll.expiresAt
      );

      let sourceUrls: string[] = [];

      //TODO: refactor this block after implementing media service
      if (files) {
        if (files.length > 10) {
          const result: DataResult<PollInputDto> = {
            statusCode: 422,
            message: "Too many files!",
            success: false,
            data: null,
          };
          return result;
        }

        if (files.length > 0) {
          sourceUrls = files.map((file) => {
            const extension = file.mimetype.split("/")[1];
            const videoExtensions = ["mp4", "mov", "avi", "mkv", "webm", "m4v"];
            const imageExtensions = ["jpg", "jpeg", "png"];

            if (videoExtensions.includes(extension)) {
              return "media/videos/" + file.filename;
            } else if (imageExtensions.includes(extension)) {
              return "media/images/" + file.filename;
            } else {
              const error: CustomError = new Error("Invalid file type!");
              error.statusCode = 422; // Unprocessable Entity
              throw error;
            }
          });
        }
      }

      const postToCreate: PostForCreate = {
        creator: user._id,
        content: {
          caption: poll.content?.caption,
          mediaUrls: sourceUrls,
        },
        poll: pollToCreate,
      };

      const newPoll: PostDoc = await this.postRepository.createPost(
        postToCreate
      );

      const result: DataResult<PollInputDto> = {
        statusCode: 201,
        message: "Poll created successfully!",
        success: true,
        data: poll,
      };
      return result;
    } catch (err) {
      throw new Error(err);
    }
  }
  async votePoll(voteInput: VoteInputDto): Promise<DataResult<VoteInputDto>> {
    try {
      const post: Post = await this.postRepository.getById(voteInput.pollId);

      const voter: User = await this.userRepository.getById(voteInput.userId);

      const creator: User = await this.userRepository.getById(
        post.getCreatorId()
      );

      if (post.poll.isExpired()) {
        const result: DataResult<VoteInputDto> = {
          statusCode: 400,
          message: "Poll has expired!",
          success: false,
          data: null,
        };
        return result;
      }

      if (post.poll.isAuthenticVoter(voter, creator)) {
        const result: DataResult<VoteInputDto> = {
          statusCode: 403,
          message: "You are not authorized to vote this poll!",
          success: false,
          data: null,
        };
        return result;
      }

      if (!post.poll.isViableVote(voteInput.option)) {
        const result: DataResult<VoteInputDto> = {
          statusCode: 404,
          message: "Option not found!",
          success: false,
          data: null,
        };
        return result;
      }

      const voted = post.poll.findVote(voter._id);

      if (voted) {
        //TODO: Refactor this block
        await this.pollRepository.deleteVote(
          post._id,
          voter._id,
          voted.optionName
        );
        if (voted.optionName === voteInput.option) {
          const result: DataResult<VoteInputDto> = {
            statusCode: 400,
            message: "You have already voted this option! Vote deleted!",
            success: false,
            data: null,
          };
          return result;
        } else {
          await this.pollRepository.votePoll(
            post._id,
            voter._id,
            voteInput.option
          );
          const result: DataResult<VoteInputDto> = {
            statusCode: 200,
            message: "Vote changed successfully!",
            success: true,
            data: voteInput,
          };
          return result;
        }
      }

      await this.pollRepository.votePoll(post._id, voter._id, voteInput.option);

      const result: DataResult<VoteInputDto> = {
        statusCode: 200,
        message: "Voted successfully!",
        success: true,
        data: voteInput,
      };
      return result;
    } catch (err) {
      throw new Error(err);
    }
  }
  async deleteVote(pollId: string, userId: string): Promise<DataResult<Poll>> {
    try {
      const post: PostDetails = await this.postRepository.getPostById(pollId);
      const user: User = await this.userRepository.getById(userId);

      const vote = post.poll.findVote(user._id);
      if (!vote) {
        const result: DataResult<Poll> = {
          statusCode: 400,
          message: "You have not voted this poll!",
          success: false,
          data: null,
        };
        return result;
      }

      const deletedPost: PostDoc = await this.pollRepository.deleteVote(
        post._id,
        user._id,
        vote.optionName
      );

      const result: DataResult<Poll> = {
        statusCode: 200,
        message: "Vote deleted successfully!",
        success: true,
        data: deletedPost.poll,
      };
      return result;
    } catch (err) {
      throw new Error(err);
    }
  }
  deletePoll(pollId: string): Promise<DataResult<PostDoc>> {
    throw new Error("Method not implemented.");
  }
}
