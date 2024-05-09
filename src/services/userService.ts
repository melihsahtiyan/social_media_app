import "reflect-metadata";
import { inject, injectable } from "inversify";
import { CustomError } from "../types/error/CustomError";
import { UserDoc } from "../models/schemas/user.schema";
import SchemaTypes from "mongoose";
import { UserRepository } from "../repositories/user-repository";
import mongoose from "mongoose";
import { UserForUpdate } from "../models/dtos/user/user-for-update";
import { Result } from "../types/result/Result";
import { DataResult } from "../types/result/DataResult";
import IUserService from "../types/services/IUserService";
import { UserDetailDto } from "../models/dtos/user/user-detail-dto";
import { clearImage } from "../util/fileUtil";

@injectable()
export class UserService implements IUserService {
  public userRepository: UserRepository;
  constructor(@inject(UserRepository) userRepository: UserRepository) {
    this.userRepository = userRepository;
  }
  async getUserById(userId: string): Promise<DataResult<UserDoc>> {
    try {
      const user: UserDoc = await this.userRepository.getById(userId);

      if (!user) {
        const result: DataResult<UserDoc> = {
          statusCode: 404,
          message: "User not found!",
          success: false,
          data: null,
        };
        return result;
      }

      const result: DataResult<UserDoc> = {
        statusCode: 200,
        message: "User fetched successfully",
        success: true,
        data: user,
      };

      return result;
    } catch (err) {
      const error: CustomError = new Error(err.message);
      error.statusCode = 500;
      throw error;
    }
  }

  async getAllDetails(): Promise<DataResult<UserDetailDto[]>> {
    try {
      const userDetailDtos: Array<UserDetailDto> =
        await this.userRepository.getAllPopulated();
      const result: DataResult<Array<UserDetailDto>> = {
        statusCode: 200,
        message: "Users fetched successfully",
        success: true,
        data: userDetailDtos,
      };
      return result;
    } catch (err) {
      const error: CustomError = new Error(err.message);
      error.statusCode = 500;
      throw error;
    }
  }

  async getAllUsers(): Promise<DataResult<Array<UserDoc>>> {
    try {
      const users: Array<UserDoc> = await this.userRepository.getAll();
      const result: DataResult<Array<UserDoc>> = {
        statusCode: 200,
        message: "Users fetched successfully",
        success: true,
        data: users,
      };
      return result;
    } catch (err) {
      const error: CustomError = new Error(err.message);
      error.statusCode = 500;
      throw error;
    }
  }

  async sendFriendRequest(
    userToFollowId: string,
    followingUserId: string
  ): Promise<Result> {
    try {
      if (userToFollowId === followingUserId) {
        const errorResult: Result = {
          statusCode: 400,
          message: "You cannot be Friend of yourself!",
          success: false,
        };
        return errorResult;
      }
      const followingUser: UserDoc = await this.userRepository.getById(
        followingUserId
      );

      if (!followingUser) {
        const result: Result = {
          statusCode: 404,
          message: "You must be logged in!",
          success: false,
        };

        return result;
      }

      const userToFollow: UserDoc = await this.userRepository.getById(
        userToFollowId
      );
      if (!userToFollow) {
        const result: Result = {
          statusCode: 404,
          message: "User to Friend not found!",
          success: false,
        };
        return result;
      }

      if (
        // Check if the user is already following the user
        followingUser.friends.includes(userToFollow._id as SchemaTypes.ObjectId)
      ) {
        // If yes, unfollow the user

        await this.userRepository.removeFriend(
          userToFollow._id,
          followingUser._id
        );

        // return res.status(200).json({ message: "User unfollowed!" });
        const result: Result = {
          statusCode: 200,
          message: "User unfriended!",
          success: true,
        };
        return result;
      }
      // Check if the user has already sent a follow request
      if (
        userToFollow.friendRequests.includes(
          followingUser._id as mongoose.Schema.Types.ObjectId
        )
      ) {
        // If yes, cancel the follow request
        await this.userRepository.deleteFriendRequest(
          userToFollow._id,
          followingUser._id
        );

        const result: Result = {
          statusCode: 200,
          message: "Friend request cancelled!",
          success: true,
        };
        return result;
      } else {
        // If not, send a follow request

        await this.userRepository.sendFriendRequest(
          userToFollow._id,
          followingUser._id
        );

        const result: Result = {
          statusCode: 200,
          message: "Friend request sent!",
          success: true,
        };
        return result;
      }
    } catch (err) {
      err.message = err.message + "\nFriend request failed";
      throw err;
    }
  }

  async unfriend(
    followingUserId: string,
    userToUnfollowId: string
  ): Promise<Result> {
    try {
      const followingUser: UserDoc = await this.userRepository.getById(
        followingUserId
      );
      const userToUnfollow: UserDoc = await this.userRepository.getById(
        userToUnfollowId
      );

      // Check 1: if the user exists
      if (!followingUser || !userToUnfollow) {
        const result: Result = {
          statusCode: 404,
          message: "User not found!",
          success: false,
        };
        return result;
      }

      // Check 2: if the user is friend with the user to unfollow
      if (!followingUser.friends.includes(userToUnfollow._id)) {
        const result: Result = {
          statusCode: 400,
          message: "User is not your friend!",
          success: false,
        };
        return result;
      }

      // Unfriend the user
      await this.userRepository.removeFriend(
        userToUnfollow._id,
        followingUser._id
      );

      const result: Result = {
        statusCode: 200,
        message: "User unfriended!",
        success: true,
      };

      return result;
    } catch (err) {
      const error: CustomError = new Error(err.message);
      error.statusCode = 500;
      throw error;
    }
  }

  async handleFollowRequest(
    receiverUserId: string,
    senderUserId: string,
    response: boolean
  ): Promise<Result> {
    try {
      const receiverUser: UserDoc = await this.userRepository.getById(
        receiverUserId
      );
      if (!receiverUser) {
        const result: Result = {
          statusCode: 404,
          message: "User not found!",
          success: false,
        };
        return result;
      }

      const senderUser: UserDoc = await this.userRepository.getById(
        senderUserId
      );

      // Check 1: if the user to follow exists
      if (!senderUser) {
        const result: Result = {
          statusCode: 404,
          message: "You must be logged in!",
          success: false,
        };
        return result;
      }

      // Check 2: if the user has a follow request from the follower user
      if (!receiverUser.friendRequests.includes(senderUser._id)) {
        const result: Result = {
          statusCode: 404,
          message: "No follow request found!",
          success: false,
        };
        return result;
      }

      // Check 3: if the user has already following user to follow
      if (receiverUser.friends.includes(senderUser._id)) {
        const result: Result = {
          statusCode: 400,
          message: "You are already friends!",
          success: false,
        };
        return result;
      }

      // Check 4: if the following user is already following the user to follow
      if (senderUser.friends.includes(receiverUser._id)) {
        const result: Result = {
          statusCode: 400,
          message: "You are already friends!",
          success: false,
        };
        return result;
      }

      // Handle the follow request
      // Possible cases: Accept or Decline
      if (response) {
        // 1st case: Accept the follow request

        await this.userRepository.acceptFriendRequest(receiverUser, senderUser);
        const result: Result = {
          statusCode: 200,
          message: "Friend request accepted!",
          success: true,
        };
        return result;
      } else {
        // 2nd case: Decline the follow request
        await this.userRepository.rejectFriendRequest(receiverUser, senderUser);

        const result: Result = {
          statusCode: 200,
          message: "Friend request rejected!",
          success: true,
        };
        return result;
      }
    } catch (err) {
      const error: CustomError = new Error(
        err.message || "Handle friend request failed"
      );
      error.statusCode = 500;
      throw error;
    }
  }

  // TODO: Global exception handling
  async updateProfile(
    userId: string,
    userForUpdate: UserForUpdate,
    file?: Express.Multer.File
  ): Promise<Result> {
    try {
      const user: UserDoc = await this.userRepository.getById(userId);

      // Check 1: if the user exists
      if (!user) {
        const result: Result = {
          statusCode: 404,
          message: "User not found!",
          success: false,
        };
        return result;
      }

      const updatedUser: UserDoc = await this.userRepository.update(
        user._id,
        userForUpdate
      );

      const result: Result = {
        statusCode: 200,
        message: "Profile updated!",
        success: true,
      };
      return result;
      // TODO: Check the catch block
    } catch (err) {
      const error: CustomError = new Error(err.message);
      error.statusCode = 500;
      throw error;
    }
  }
  async changeProfilePhoto(
    userId: string,
    file?: Express.Multer.File
  ): Promise<Result> {
    try {
      const user: UserDoc = await this.userRepository.getById(userId);

      // Check 1: if the user exists
      if (!user) {
        const result: Result = {
          statusCode: 404,
          message: "User not found!",
          success: false,
        };
        return result;
      }

      if (!file) {
        const result: Result = {
          statusCode: 400,
          message: "You have not uploaded profile photo!",
          success: false,
        };
        return result;
      }

      if (!user.profilePhotoUrl) {
        const updatedUser: UserDoc =
          await this.userRepository.updateprofilePhoto(user._id, file.path);

        const result: Result = {
          statusCode: 200,
          message: "Profile photo added!",
          success: true,
        };
        return result;
      } else {
        clearImage(user.profilePhotoUrl);

        const updatedUser: UserDoc =
          await this.userRepository.updateprofilePhoto(user._id, file.path);

        const result: Result = {
          statusCode: 200,
          message: "Profile photo updated!",
          success: true,
        };

        return result;
      }
    } catch (err) {
      const error: CustomError = new Error(err.message);
      error.statusCode = 500;
      throw error;
    }
  }

  async deleteProfilePhoto(userId: string): Promise<Result> {
    try {
      const user: UserDoc = await this.userRepository.getById(userId);

      // Check 1: if the user exists
      if (!user) {
        const result: Result = {
          statusCode: 404,
          message: "User not found!",
          success: false,
        };
        return result;
      }

      if (!user.profilePhotoUrl) {
        const result: Result = {
          statusCode: 400,
          message: "You have not uploaded profile photo yet!",
          success: false,
        };
        return result;
      }

      clearImage(user.profilePhotoUrl);

      const updatedUser: UserDoc = await this.userRepository.deleteProfilePhoto(
        user._id
      );

      const result: Result = {
        statusCode: 200,
        message: "Profile photo deleted!",
        success: true,
      };

      return result;
    } catch (err) {
      const error: CustomError = new Error(err.message);
      error.statusCode = 500;
      throw error;
    }
  }
}
