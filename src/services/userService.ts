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

@injectable()
export class UserService implements IUserService {
  public userRepository: UserRepository;
  constructor(@inject(UserRepository) userRepository: UserRepository) {
    this.userRepository = userRepository;
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

  async followUser(
    userToFollowId: string,
    followingUserId: string
  ): Promise<Result> {
    try {
      if (userToFollowId === followingUserId) {
        const errorResult: Result = {
          statusCode: 400,
          message: "You cannot follow yourself!",
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
          message: "User to follow not found!",
          success: false,
        };
        return result;
      }

      if (
        // Check if the user is already following the user
        followingUser.following.includes(
          userToFollow._id as SchemaTypes.ObjectId
        )
      ) {
        // If yes, unfollow the user

        await this.userRepository.unfollowUser(
          userToFollow._id,
          followingUser._id
        );

        // return res.status(200).json({ message: "User unfollowed!" });
        const result: Result = {
          statusCode: 200,
          message: "User unfollowed!",
          success: true,
        };
        return result;
      }
      // Check if the user has already sent a follow request
      if (
        userToFollow.followRequests.includes(
          followingUser._id as mongoose.Schema.Types.ObjectId
        )
      ) {
        // If yes, cancel the follow request
        await this.userRepository.deleteFollowRequest(
          userToFollow._id,
          followingUser._id
        );

        const result: Result = {
          statusCode: 200,
          message: "Follow request cancelled!",
          success: true,
        };
        return result;
      } else {
        // If not, send a follow request

        await this.userRepository.sendFollowRequest(
          userToFollow._id,
          followingUser._id
        );

        const result: Result = {
          statusCode: 200,
          message: "Follow request sent!",
          success: true,
        };
        return result;
      }
    } catch (err) {
      err.message = err.message + "\nFollowing user failed";
      throw err;
    }
  }

  async handleFollowRequest(
    userToFollowId: string,
    followingUserId: string,
    followResponse: boolean
  ): Promise<Result> {
    try {
      const userToFollow: UserDoc = await this.userRepository.getById(
        userToFollowId
      );
      if (!userToFollow) {
        const result: Result = {
          statusCode: 404,
          message: "User not found!",
          success: false,
        };
        return result;
      }

      const followingUser: UserDoc = await this.userRepository.getById(
        followingUserId
      );

      // Check 1: if the user to follow exists
      if (!followingUser) {
        const result: Result = {
          statusCode: 404,
          message: "You must be logged in!",
          success: false,
        };
        return result;
      }

      // Check 2: if the user has a follow request from the follower user
      if (!userToFollow.followRequests.includes(followingUser._id)) {
        const result: Result = {
          statusCode: 404,
          message: "No follow request found!",
          success: false,
        };
        return result;
      }

      // Check 3: if the user has already following user to follow
      if (userToFollow.followers.includes(followingUser._id)) {
        const result: Result = {
          statusCode: 400,
          message: "Follower is already following you!",
          success: false,
        };
        return result;
      }

      // Check 4: if the following user is already following the user to follow
      if (followingUser.following.includes(userToFollow._id)) {
        const result: Result = {
          statusCode: 400,
          message: "User is already following you!",
          success: false,
        };
        return result;
      }

      // Handle the follow request
      // Possible cases: Accept or Decline
      if (followResponse) {
        // 1st case: Accept the follow request

        await this.userRepository.acceptFollowRequest(
          userToFollow,
          followingUser
        );
        const result: Result = {
          statusCode: 200,
          message: "Follow request accepted!",
          success: true,
        };
        return result;
      } else {
        // 2nd case: Decline the follow request
        await this.userRepository.rejectFollowRequest(
          userToFollow,
          followingUser
        );

        const result: Result = {
          statusCode: 200,
          message: "Follow request rejected!",
          success: true,
        };
        return result;
      }
    } catch (err) {
      const error: CustomError = new Error(
        err.message || "Handle follow request failed"
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
}
