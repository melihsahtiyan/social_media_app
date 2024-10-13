import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { IPollService } from '../types/services/IPollService';
import { DataResult } from '../types/result/DataResult';
import { PollInputDto } from '../models/dtos/post/poll/poll-input-dto';
import { PostForCreate } from '../models/dtos/post/post-for-create';
import { Poll } from '../models/entities/Poll';
import { CustomError } from '../types/error/CustomError';
import { VoteInputDto } from '../models/dtos/post/poll/vote-input-dto';
import { User } from '../models/entities/User';
import { Post } from '../models/entities/Post';
import { Schema } from 'mongoose';
import { IPollRepository } from '../types/repositories/IPollRepository';
import IPostRepository from '../types/repositories/IPostRepository';
import IUserRepository from '../types/repositories/IUserRepository';
import { ICloudinaryService } from '../types/services/ICloudinaryService';
import TYPES from '../util/ioc/types';
import { Result } from '../types/result/Result';

@injectable()
export class PollService implements IPollService {
	private pollRepository: IPollRepository;
	private postRepository: IPostRepository;
	private userRepository: IUserRepository;
	private readonly cloudinaryService: ICloudinaryService;
	constructor(
		@inject(TYPES.IPollRepository) pollRepository: IPollRepository,
		@inject(TYPES.IPostRepository) postRepository: IPostRepository,
		@inject(TYPES.IUserRepository) userRepository: IUserRepository,
		@inject(TYPES.ICloudinaryService) cloudinaryService: ICloudinaryService
	) {
		this.pollRepository = pollRepository;
		this.postRepository = postRepository;
		this.userRepository = userRepository;
		this.cloudinaryService = cloudinaryService;
	}

	async createPoll(
		userId: string,
		poll: PollInputDto,
		files?: Express.Multer.File[]
	): Promise<DataResult<PollInputDto>> {
		try {
			// TODO: Refactor this block with Post Service
			const user: User = await this.userRepository.getById(userId);

			if (!user) {
				const result: DataResult<PollInputDto> = {
					statusCode: 404,
					message: 'User not found!',
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
			}> = poll.options.map(option => {
				return {
					optionName: option,
					votes: [],
				};
			});

			const pollToCreate: Poll = new Poll({
				question: poll.question,
				options,
				totalVotes: 0,
				expiresAt: poll.expiresAt,
			});

			const sourceUrls: string[] = [];

			//TODO: refactor this block after implementing media service
			if (files) {
				if (files.length > 10) {
					const result: DataResult<PollInputDto> = {
						statusCode: 422,
						message: 'Too many files!',
						success: false,
						data: null,
					};
					return result;
				}

				if (files.length > 0) {
					files.map(async file => {
						const publicId: string = await this.cloudinaryService.handleUpload(file, 'media');

						sourceUrls.push(publicId);
					});

					if (sourceUrls.length === 0) {
						const result: DataResult<PollInputDto> = {
							statusCode: 422,
							message: 'Media upload failed!',
							success: false,
							data: null,
						};
						return result;
					}
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

			await this.postRepository.create(postToCreate);

			const result: DataResult<PollInputDto> = {
				statusCode: 201,
				message: 'Poll created successfully!',
				success: true,
				data: poll,
			};
			return result;
		} catch (err) {
			const error: CustomError = new Error(err.message);
			error.statusCode = 500; // Internal Server Error
			throw error;
		}
	}
	async votePoll(voteInput: VoteInputDto): Promise<DataResult<VoteInputDto>> {
		try {
			const post: Post = await this.postRepository.getById(voteInput.pollId);

			const voter: User = await this.userRepository.getById(voteInput.userId);

			const creator: User = await this.userRepository.getById(post.getCreatorId());

			if (post.poll.isExpired()) {
				const result: DataResult<VoteInputDto> = {
					statusCode: 400,
					message: 'Poll has expired!',
					success: false,
					data: null,
				};
				return result;
			}

			if (post.poll.isAuthenticVoter(voter, creator)) {
				const result: DataResult<VoteInputDto> = {
					statusCode: 403,
					message: 'You are not authorized to vote this poll!',
					success: false,
					data: null,
				};
				return result;
			}

			if (!post.poll.isViableVote(voteInput.option)) {
				const result: DataResult<VoteInputDto> = {
					statusCode: 404,
					message: 'Option not found!',
					success: false,
					data: null,
				};
				return result;
			}

			const voted = post.poll.findVote(voter._id);

			if (voted) {
				//TODO: Refactor this block
				await this.pollRepository.deleteVote(post._id, voter._id, voted.optionName);
				if (voted.optionName === voteInput.option) {
					const result: DataResult<VoteInputDto> = {
						statusCode: 400,
						message: 'You have already voted this option! Vote deleted!',
						success: false,
						data: null,
					};
					return result;
				} else {
					await this.pollRepository.vote(post._id, voter._id, voteInput.option);
					const result: DataResult<VoteInputDto> = {
						statusCode: 200,
						message: 'Vote changed successfully!',
						success: true,
						data: voteInput,
					};
					return result;
				}
			}

			await this.pollRepository.vote(post._id, voter._id, voteInput.option);

			const result: DataResult<VoteInputDto> = {
				statusCode: 200,
				message: 'Voted successfully!',
				success: true,
				data: voteInput,
			};
			return result;
		} catch (err) {
			const error: CustomError = new Error(err.message);
			error.statusCode = 500; // Internal Server Error
			throw error;
		}
	}
	async deleteVote(pollId: string, userId: string): Promise<Result> {
		try {
			const post: Post = await this.postRepository.getById(pollId);
			const user: User = await this.userRepository.getById(userId);

			const vote = post.poll.findVote(user._id);
			if (!vote) {
				const result: DataResult<boolean> = {
					statusCode: 400,
					message: 'You have not voted this poll!',
					success: false,
				};
				return result;
			}

			const isDeleted: boolean = await this.pollRepository.deleteVote(post._id, user._id, vote.optionName);

			const result: Result = {
				statusCode: isDeleted ? 200 : 400,
				message: isDeleted ? 'Vote deleted successfully!' : 'Vote deletion failed!',
				success: isDeleted,
			};
			return result;
		} catch (err) {
			const error: CustomError = new Error(err.message);
			error.statusCode = 500; // Internal Server Error
			throw error;
		}
	}
	// deletePoll(pollId: string): Promise<DataResult<PostDoc>> {
	// 	throw new Error('Method not implemented.');
	// }
}
