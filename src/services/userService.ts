import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import IUserService from '../types/services/IUserService';
import { CustomError } from '../types/error/CustomError';
import { Result } from '../types/result/Result';
import { DataResult } from '../types/result/DataResult';
import { User } from '../models/entities/User';
import { UserDoc } from '../models/schemas/user.schema';
import { UserForUpdate } from '../models/dtos/user/user-for-update';
import { UserDetailDto } from '../models/dtos/user/user-detail-dto';
import { UserListDto } from '../models/dtos/user/user-list-dto';
import { UserForSearchDto } from '../models/dtos/user/user-for-search-dto';
import { UserProfileDto } from '../models/dtos/user/user-profile-dto';
import IUserRepository from '../types/repositories/IUserRepository';
import { ICloudinaryService } from '../types/services/ICloudinaryService';
import TYPES from '../util/ioc/types';

@injectable()
export class UserService implements IUserService {
	private readonly userRepository: IUserRepository;
	private readonly cloudinaryService: ICloudinaryService;
	constructor(
		@inject(TYPES.IUserRepository) userRepository: IUserRepository,
		@inject(TYPES.ICloudinaryService) cloudinaryService: ICloudinaryService
	) {
		this.userRepository = userRepository;
		this.cloudinaryService = cloudinaryService;
	}
	async getAllUsers(): Promise<DataResult<Array<UserListDto>>> {
		try {
			const users: Array<UserListDto> = await this.userRepository.getAll({});
			const result: DataResult<Array<UserListDto>> = {
				statusCode: 200,
				message: 'Users fetched successfully',
				success: true,
				data: users,
			};
			return result;
		} catch (err) {
			const error: CustomError = new Error(err);
			error.statusCode = err?.statusCode || 500;

			throw err;
		}
	}
	async getAllDetails(): Promise<DataResult<UserDoc[]>> {
		try {
			const users: Array<UserDoc> = await this.userRepository.getAllPopulated();
			const result: DataResult<Array<UserDoc>> = {
				statusCode: 200,
				message: 'Users fetched successfully',
				success: true,
				data: users,
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
					data: null,
				};
				return result;
			}

			const result: DataResult<User> = {
				statusCode: 200,
				message: 'User fetched successfully',
				success: true,
				data: user,
			};

			return result;
		} catch (err) {
			const error: CustomError = new Error(err);
			error.statusCode = err?.statusCode || 500;

			throw err;
		}
	}
	async getUsersByIds(userIds: Array<string>): Promise<DataResult<Array<User>>> {
		try {
			const users: User[] = await this.userRepository.getUsersByIds(userIds as string[]);

			const result: DataResult<Array<User>> = {
				statusCode: 200,
				message: 'Users fetched successfully',
				success: true,
				data: users,
			};

			return result;
		} catch (err) {
			const error: CustomError = new Error(err);

			error.className = 'UserService';
			error.functionName = 'getUsersByIds';

			throw err;
		}
	}

	async viewUserProfile(userId: string, viewerId: string): Promise<DataResult<UserProfileDto | UserDetailDto>> {
		try {
			const user: User = await this.userRepository.getUserProfile(userId);

			const viewer: User = await this.userRepository.getById(viewerId);

			if (!viewer) {
				const result: DataResult<UserProfileDto> = {
					statusCode: 404,
					message: 'You must be logged in!',
					success: false,
					data: null,
				};
				return result;
			}

			if (!user) {
				const result: DataResult<UserProfileDto> = {
					statusCode: 404,
					message: 'User not found!',
					success: false,
					data: null,
				};
				return result;
			}

			const friends: User[] = await this.userRepository.getUsersByIds(user.friends.map(friend => friend.toString()));

			const friendDetails: Array<{
				_id: string;
				firstName: string;
				lastName: string;
				profilePhotoUrl: string;
			}> = friends.map(friend => {
				return {
					_id: friend._id.toString(),
					firstName: friend.firstName,
					lastName: friend.lastName,
					profilePhotoUrl: friend.profilePhotoUrl,
				};
			});

			const friendRequests: User[] = await this.userRepository.getUsersByIds(
				user.friendRequests.map(request => request.toString())
			);

			const friendRequestDetails: Array<{
				_id: string;
				firstName: string;
				lastName: string;
				profilePhotoUrl: string;
			}> = friendRequests.map(request => {
				return {
					_id: request._id.toString(),
					firstName: request.firstName,
					lastName: request.lastName,
					profilePhotoUrl: request.profilePhotoUrl,
				};
			});

			const userProfileDto: UserProfileDto = {
				_id: user._id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				university: user.university,
				department: user.department,
				profilePhotoUrl: user.profilePhotoUrl,
				friends: friendDetails,
				friendRequests: friendRequestDetails,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
				friendCount: user.friends.length,
				isFriend: viewer.isFriend(user._id),
				posts: user.posts,
			};

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
				data: userProfileDto,
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
			const userList: User[] = await this.userRepository.searchByName(name);

			const viewer: User = await this.userRepository.getById(userId);

			if (!viewer) {
				const result: DataResult<UserForSearchDto[]> = {
					statusCode: 403,
					message: 'You must be logged in!',
					success: false,
					data: null,
				};
				return result;
			}

			const usersByName: UserForSearchDto[] = [];

			userList.forEach(user => {
				const userForSearchDto: UserForSearchDto = {
					_id: user._id,
					fullName: user.getFullName(),
					profilePhotoUrl: user.profilePhotoUrl,
					isFriend: viewer.isFriend(user._id),
				};

				usersByName.push(userForSearchDto);
			});

			const result: DataResult<UserForSearchDto[]> = {
				statusCode: 200,
				message: 'Users fetched successfully',
				success: true,
				data: usersByName,
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
					success: false,
				};
				return result;
			}

			await this.userRepository.update(user.getId(), userForUpdate);

			const result: Result = {
				statusCode: 200,
				message: 'Profile updated!',
				success: true,
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
					success: false,
				};
				return result;
			}

			if (!file) {
				const result: Result = {
					statusCode: 400,
					message: 'You have not uploaded profile photo!',
					success: false,
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
						success: false,
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
				success: true,
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
					success: false,
				};
				return result;
			}

			if (!user.profilePhotoUrl) {
				const result: Result = {
					statusCode: 400,
					message: 'You have not uploaded profile photo yet!',
					success: false,
				};
				return result;
			}

			const isDeleted: boolean = await this.cloudinaryService.handleDelete(user.profilePhotoUrl);

			if (!isDeleted) {
				const result: Result = {
					statusCode: 500,
					message: 'Profile photo deletion error!',
					success: false,
				};
				return result;
			}

			await this.userRepository.deleteProfilePhoto(user.getId());

			const result: Result = {
				statusCode: 200,
				message: 'Profile photo deleted!',
				success: true,
			};

			return result;
		} catch (err) {
			const error: CustomError = new Error(err);
			error.statusCode = err?.statusCode || 500;

			throw err;
		}
	}
}
