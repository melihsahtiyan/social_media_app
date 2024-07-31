import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import IUserService from '../types/services/IUserService';
import { UserRepository } from '../repositories/user-repository';
import { CloudinaryService } from './cloudinaryService';
import { CustomError } from '../types/error/CustomError';
import { UserForUpdate } from '../models/dtos/user/user-for-update';
import { Result } from '../types/result/Result';
import { DataResult } from '../types/result/DataResult';
import { UserDetailDto } from '../models/dtos/user/user-detail-dto';
import { UserListDto } from '../models/dtos/user/user-list-dto';
import { UserForSearchDto } from '../models/dtos/user/user-for-search-dto';
import { UserProfileDto } from '../models/dtos/user/user-profile-dto';
import { UserForRequestDto } from '../models/dtos/user/user-for-request-dto';
import { User } from '../models/entites/User';
import { UserDoc } from '../models/schemas/user.schema';

@injectable()
export class UserService implements IUserService {
	private readonly userRepository: UserRepository;
	private readonly cloudinaryService: CloudinaryService;
	constructor(
		@inject(UserRepository) userRepository: UserRepository,
		@inject(CloudinaryService) cloudinaryService: CloudinaryService
	) {
		this.userRepository = userRepository;
		this.cloudinaryService = cloudinaryService;
	}
	async getAllUsers(): Promise<DataResult<Array<UserListDto>>> {
		try {
			const users: Array<UserListDto> = await this.userRepository.getAll();
			const result: DataResult<Array<UserListDto>> = {
				statusCode: 200,
				message: 'Users fetched successfully',
				success: true,
				data: users
			};
			return result;
		} catch (err) {
			const error: CustomError = new Error(err);
			error.statusCode = err?.statusCode || 500;

			throw err;
		}
	}
	async getAllDetails(): Promise<DataResult<UserProfileDto[]>> {
		try {
			const userDetailDtos: Array<UserProfileDto> = await this.userRepository.getAllPopulated();
			const result: DataResult<Array<UserProfileDto>> = {
				statusCode: 200,
				message: 'Users fetched successfully',
				success: true,
				data: userDetailDtos
			};
			return result;
		} catch (err) {
			const error: CustomError = new Error(err);
			error.statusCode = err?.statusCode || 500;

			throw err;
		}
	}

	async getUserById(userId: string): Promise<DataResult<User>> {
		try {
			const user: User = await this.userRepository.getById(userId);

			if (!user) {
				const result: DataResult<User> = {
					statusCode: 404,
					message: 'User not found!',
					success: false,
					data: null
				};
				return result;
			}

			const result: DataResult<User> = {
				statusCode: 200,
				message: 'User fetched successfully',
				success: true,
				data: user
			};

			return result;
		} catch (err) {
			const error: CustomError = new Error(err);
			error.statusCode = err?.statusCode || 500;

			throw err;
		}
	}

	//TODO: Refactor the viewUserDetails and viewUserProfile method
	async viewUserDetails(userId: string, viewerId: string): Promise<DataResult<UserDetailDto>> {
		try {
			const user: UserDetailDto = await this.userRepository.getUserDetails(userId);

			const viewer: User = await this.userRepository.getById(viewerId);

			if (!user) {
				const result: DataResult<UserDetailDto> = {
					statusCode: 404,
					message: 'User not found!',
					success: false,
					data: null
				};
				return result;
			}

			if (!viewer) {
				const result: DataResult<UserDetailDto> = {
					statusCode: 403,
					message: 'You must be logged in!',
					success: false,
					data: null
				};
				return result;
			}

			const result: DataResult<UserDetailDto> = {
				statusCode: 200,
				message: 'User fetched successfully',
				success: true,
				data: user
			};

			return result;
		} catch (err) {
			const error: CustomError = new Error(err);
			error.statusCode = err?.statusCode || 500;

			throw err;
		}
	}
	async viewUserProfile(userId: string, viewerId: string): Promise<DataResult<UserProfileDto | UserDetailDto>> {
		try {
			const user: UserProfileDto = await this.userRepository.getUserProfile(userId);

			const viewer: User = await this.userRepository.getById(viewerId);

			if (!viewer) {
				const result: DataResult<UserProfileDto> = {
					statusCode: 404,
					message: 'You must be logged in!',
					success: false,
					data: null
				};
				return result;
			}

			if (!user) {
				const result: DataResult<UserProfileDto> = {
					statusCode: 404,
					message: 'User not found!',
					success: false,
					data: null
				};
				return result;
			}

			if (viewer.isFriend(user._id)) {
				user.isFriend = true;
			} else {
				user.isFriend = false;
			}

			// if (!viewer.isFriendOrSameUniversity(user)) {
			//   const result: DataResult<UserProfileDto> = {
			//     statusCode: 403,
			//     message: "You are not authorized to view this user!",
			//     success: false,
			//     data: null,
			//   };
			//   return result;
			// }

			const result: DataResult<UserProfileDto> = {
				statusCode: 200,
				message: 'User fetched successfully!',
				success: true,
				data: user
			};
			return result;
		} catch (err) {
			const error: CustomError = new Error(err);
			error.statusCode = err?.statusCode || 500;

			throw err;
		}
	}
	async searchByName(name: string, userId: string): Promise<DataResult<UserForSearchDto[]>> {
		try {
			const usersByName: UserForSearchDto[] = await this.userRepository.searchByName(name);

			const viewer: User = await this.userRepository.getById(userId);

			if (!viewer) {
				const result: DataResult<UserForSearchDto[]> = {
					statusCode: 403,
					message: 'You must be logged in!',
					success: false,
					data: null
				};
				return result;
			}

			usersByName.forEach((user: UserForSearchDto) => {
				if (viewer.isFriend(user._id)) {
					user.isFriend = true;
				} else {
					user.isFriend = false;
				}
			});

			const result: DataResult<UserForSearchDto[]> = {
				statusCode: 200,
				message: 'Users fetched successfully',
				success: true,
				data: usersByName
			};

			return result;
		} catch (err) {
			const error: CustomError = new Error(err);
			error.statusCode = err?.statusCode || 500;

			throw err;
		}
	}

	async getAllFriendRequests(userId: string): Promise<DataResult<UserForRequestDto[]>> {
		try {
			const user: User = await this.userRepository.getById(userId);

			if (!user) {
				const result: DataResult<UserForRequestDto[]> = {
					statusCode: 404,
					message: 'You must be logged in!',
					success: false,
					data: null
				};
				return result;
			}

			const friendRequests: UserForRequestDto[] = await this.userRepository.getAllFriendRequests(user.getId());

			const result: DataResult<UserForRequestDto[]> = {
				statusCode: 200,
				message: 'Friend requests fetched successfully',
				success: true,
				data: friendRequests
			};

			return result;
		} catch (err) {
			const error: CustomError = new Error(err);
			error.statusCode = err?.statusCode || 500;

			throw err;
		}
	}
	async updateProfile(userId: string, userForUpdate: UserForUpdate): Promise<Result> {
		try {
			const user: User = await this.userRepository.getById(userId);

			// Check 1: if the user exists
			if (!user) {
				const result: Result = {
					statusCode: 404,
					message: 'User not found!',
					success: false
				};
				return result;
			}

			await this.userRepository.update(user.getId(), userForUpdate);

			const result: Result = {
				statusCode: 200,
				message: 'Profile updated!',
				success: true
			};
			return result;
			// TODO: Check the catch block
		} catch (err) {
			const error: CustomError = new Error(err);
			error.statusCode = err?.statusCode || 500;

			throw err;
		}
	}

	async changeProfilePhoto(userId: string, file?: Express.Multer.File): Promise<Result> {
		try {
			const user: User = await this.userRepository.getById(userId);

			// Check 1: if the user exists
			if (!user) {
				const result: Result = {
					statusCode: 404,
					message: 'User not found!',
					success: false
				};
				return result;
			}

			if (!file) {
				const result: Result = {
					statusCode: 400,
					message: 'You have not uploaded profile photo!',
					success: false
				};
				return result;
			}

			let message: string = 'Profile photo added!';

			if (user.profilePhotoUrl) {
				const isDeleted: boolean = await this.cloudinaryService.handleDelete(user.profilePhotoUrl);

				if (!isDeleted) {
					const result: Result = {
						statusCode: 500,
						message: 'Profile photo deletion error!',
						success: false
					};
					return result;
				}
				message = 'Profile photo updated!';
			}

			const profilePhotoUrl: string = await this.cloudinaryService.handleUpload(file, 'profilePhoto');

			await this.userRepository.updateprofilePhoto(user.getId(), profilePhotoUrl);

			const result: Result = {
				statusCode: 200,
				message: message,
				success: true
			};

			return result;
		} catch (err) {
			const error: CustomError = new Error(err);
			error.statusCode = err?.statusCode || 500;

			throw err;
		}
	}
	async sendFriendRequest(userToFollowId: string, followingUserId: string): Promise<Result> {
		try {
			if (userToFollowId === followingUserId) {
				const errorResult: Result = {
					statusCode: 400,
					message: 'You cannot be Friend of yourself!',
					success: false
				};
				return errorResult;
			}

			const followingUser: User = await this.userRepository.getById(followingUserId);

			if (!followingUser) {
				const result: Result = {
					statusCode: 404,
					message: 'You must be logged in!',
					success: false
				};

				return result;
			}

			const userToFollow: User = await this.userRepository.getById(userToFollowId);

			if (!userToFollow) {
				const result: Result = {
					statusCode: 404,
					message: 'User to Friend not found!',
					success: false
				};
				return result;
			}

			if (
				// Check if the user is already following the user
				followingUser.isFriend(userToFollow._id)
			) {
				const result: Result = {
					statusCode: 400,
					message: 'You are already friends!',
					success: false
				};
				return result;
			}
			// Check if the user has already sent a follow request
			if (userToFollow.hasFriendRequest(followingUser._id)) {
				// If yes, cancel the follow request
				await this.userRepository.deleteFriendRequest(userToFollow._id, followingUser._id);

				const result: Result = {
					statusCode: 200,
					message: 'Friend request cancelled!',
					success: true
				};
				return result;
			} else {
				// If not, send a follow request

				await this.userRepository.sendFriendRequest(userToFollow._id, followingUser._id);

				const result: Result = {
					statusCode: 200,
					message: 'Friend request sent!',
					success: true
				};
				return result;
			}
		} catch (err) {
			const error: CustomError = new Error(err);
			error.statusCode = err?.statusCode || 500;

			throw err;
		}
	}

	async handleFriendRequest(receiverUserId: string, senderUserId: string, response: boolean): Promise<Result> {
		try {
			const receiverUser: User = await this.userRepository.getById(receiverUserId);

			if (!receiverUser) {
				const result: Result = {
					statusCode: 404,
					message: 'You must be logged in!',
					success: false
				};
				return result;
			}

			const senderUser: User = await this.userRepository.getById(senderUserId);

			// Check 1: if the user to follow exists
			if (!senderUser) {
				const result: Result = {
					statusCode: 404,
					message: 'User not found!',
					success: false
				};
				return result;
			}

			// Check 2: if the user has already following user to follow
			if (receiverUser.isFriend(senderUser._id) && senderUser.isFriend(receiverUser._id)) {
				const result: Result = {
					statusCode: 400,
					message: 'You are already friends!',
					success: false
				};
				return result;
			}

			// Check 3: if the user has a follow request from the follower user
			if (!receiverUser.hasFriendRequest(senderUser._id)) {
				const result: Result = {
					statusCode: 404,
					message: 'No follow request found!',
					success: false
				};
				return result;
			}

			// Handle the follow request
			// Possible cases: Accept or Decline
			if (response) {
				// 1st case: Accept the follow request

				await this.userRepository.acceptFriendRequest(receiverUser as UserDoc, senderUser as UserDoc);
				const result: Result = {
					statusCode: 200,
					message: 'Friend request accepted!',
					success: true
				};
				return result;
			} else {
				// 2nd case: Decline the follow request
				await this.userRepository.rejectFriendRequest(receiverUser as UserDoc, senderUser as UserDoc);

				const result: Result = {
					statusCode: 200,
					message: 'Friend request rejected!',
					success: true
				};
				return result;
			}
		} catch (err) {
			const error: CustomError = new Error(err);
			error.statusCode = err?.statusCode || 500;

			throw err;
		}
	}
	async unfriend(followingUserId: string, userToUnfollowId: string): Promise<Result> {
		try {
			const followingUser: User = await this.userRepository.getById(followingUserId);
			const userToUnfollow: User = await this.userRepository.getById(userToUnfollowId);

			// Check 1: if the user exists
			if (!followingUser || !userToUnfollow) {
				const result: Result = {
					statusCode: 404,
					message: 'User not found!',
					success: false
				};
				return result;
			}

			// Check 2: if the user is friend with the user to unfollow
			if (!followingUser.isFriend(userToUnfollow._id) && !userToUnfollow.isFriend(followingUser._id)) {
				const result: Result = {
					statusCode: 400,
					message: 'You are not friends!',
					success: false
				};
				return result;
			}

			// Unfriend the user
			await this.userRepository.removeFriend(userToUnfollow.getId(), followingUser.getId());

			const result: Result = {
				statusCode: 200,
				message: 'User unfriended!',
				success: true
			};

			return result;
		} catch (err) {
			const error: CustomError = new Error(err);
			error.statusCode = err?.statusCode || 500;

			throw err;
		}
	}

	async deleteProfilePhoto(userId: string): Promise<Result> {
		try {
			const user: User = await this.userRepository.getById(userId);

			// Check 1: if the user exists
			if (!user) {
				const result: Result = {
					statusCode: 404,
					message: 'User not found!',
					success: false
				};
				return result;
			}

			if (!user.profilePhotoUrl) {
				const result: Result = {
					statusCode: 400,
					message: 'You have not uploaded profile photo yet!',
					success: false
				};
				return result;
			}

			const isDeleted: boolean = await this.cloudinaryService.handleDelete(user.profilePhotoUrl);

			if (!isDeleted) {
				const result: Result = {
					statusCode: 500,
					message: 'Profile photo deletion error!',
					success: false
				};
				return result;
			}

			await this.userRepository.deleteProfilePhoto(user.getId());

			const result: Result = {
				statusCode: 200,
				message: 'Profile photo deleted!',
				success: true
			};

			return result;
		} catch (err) {
			const error: CustomError = new Error(err);
			error.statusCode = err?.statusCode || 500;

			throw err;
		}
	}
}
