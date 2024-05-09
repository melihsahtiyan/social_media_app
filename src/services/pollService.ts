import { inject, injectable } from "inversify";
import { PollRepository } from "../repositories/poll-repository";
import { IPollService } from "../types/services/IPollService";
import { PostDoc } from "../models/schemas/post.schema";
import { PostRepository } from "../repositories/post-repository";
import { UserRepository } from "../repositories/user-repository";
import { UserDoc } from "../models/schemas/user.schema";
import { DataResult } from "../types/result/DataResult";
import { Schema } from "mongoose";
import { PollInputDto } from "../models/dtos/post/poll/poll-input-dto";
import { PostForCreate } from "../models/dtos/post/post-for-create";
import { Poll } from "../models/entites/Poll";
import { CustomError } from "../types/error/CustomError";
import { PostDetails } from "src/models/dtos/post/post-details";

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
  ): Promise<DataResult<PostDoc>> {
    try {
      const user: UserDoc = await this.userRepository.getById(userId);

      if (!user) {
        const result: DataResult<PostDoc> = {
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

      const options: Array<{ optionName: string; votes: number }> =
        poll.options.map((option) => {
          return {
            optionName: option,
            votes: 0,
          };
        });

      const pollToCreate: Poll = {
        question: poll.question,
        options: options,
        votes: [],
        totalVotes: 0,
        expiresAt: poll.expiresAt,
      };

      let sourceUrls: string[] = [];

      if (files) {
        if (files.length > 10) {
          const result: DataResult<PostDoc> = {
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
          caption: poll.question,
          mediaUrls: sourceUrls,
        },
        poll: pollToCreate,
      };

      const newPoll: PostDoc = await this.postRepository.createPost(
        postToCreate
      );

      const result: DataResult<PostDoc> = {
        statusCode: 201,
        message: "Poll created successfully!",
        success: true,
        data: newPoll,
      };
      return result;
    } catch (err) {
      throw new Error(err);
    }
  }
  async votePoll(
    pollId: string,
    userId: string,
    optionName: string
  ): Promise<DataResult<PostDetails>> {
    try {
      const post: PostDetails = await this.postRepository.getPostById(pollId);

      const voter: UserDoc = await this.userRepository.getById(userId);

      if (post.poll.expiresAt < new Date(Date.now())) {
        const result: DataResult<PostDetails> = {
          statusCode: 400,
          message: "Poll has expired!",
          success: false,
          data: null,
        };
        return result;
      }

      if (
        !(
          voter.friends.includes(post.creator._id) ||
          voter.university === post.creator.university
        )
      ) {
        const result: DataResult<PostDetails> = {
          statusCode: 403,
          message: "You are not authorized to vote this poll!",
          success: false,
          data: null,
        };
        return result;
      }

      const option = post.poll.options.find(
        (opt) => opt.optionName === optionName
      );

      if (!option) {
        const result: DataResult<PostDetails> = {
          statusCode: 400,
          message: "Option not found!",
          success: false,
          data: null,
        };
        return result;
      }

      const voted = post.poll.votes.find(
        (vote) => vote.voter.toString() === userId
      );

      if (voted) {
        if (voted.option === optionName) {
          const result: DataResult<PostDetails> = {
            statusCode: 400,
            message: "You have already voted this option!\nVote deleted!",
            success: false,
            data: null,
          };
          return result;
        }
        await this.pollRepository.deleteVote(post._id, voter._id);
      }

      await this.pollRepository.votePoll(post._id, voter._id, optionName);

      const result: DataResult<PostDetails> = {
        statusCode: 200,
        message: "Voted successfully!",
        success: true,
        data: post,
      };
      return result;
    } catch (err) {
      throw new Error(err);
    }
  }
  async deleteVote(
    pollId: string,
    userId: string
  ): Promise<DataResult<PostDoc>> {
    try {
      const post: PostDetails = await this.postRepository.getPostById(pollId);
      const user: UserDoc = await this.userRepository.getById(userId);

      if (!post.poll.votes.find((vote) => vote.voter.toString() === userId)) {
        const result: DataResult<PostDoc> = {
          statusCode: 400,
          message: "You have not voted this poll!",
          success: false,
          data: null,
        };
        return result;
      }

      const updatedPost: PostDoc = await this.pollRepository.deleteVote(
        post._id,
        user._id
      );

      const result: DataResult<PostDoc> = {
        statusCode: 200,
        message: "Vote deleted successfully!",
        success: true,
        data: updatedPost,
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
