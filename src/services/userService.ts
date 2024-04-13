import { CustomError } from "../types/error/CustomError";
import { UserDoc } from "../models/mongoose/UserDoc";
import SchemaTypes from "mongoose";
import { UserRepository } from "../repositories/user-repository";
import mongoose from "mongoose";
import { UserForUpdate } from "../models/dtos/user/user-for-update";
import { Result } from "../types/result/Result";
import { DataResult } from "src/types/result/DataResult";

export class UserService {
  _userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this._userRepository = userRepository;
  }

  getAllUsers = async (): Promise<DataResult<Array<UserDoc>>> => {
    try {
      const users: Array<UserDoc> = await this._userRepository.getAll();
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
  };

  followUser = async (
    followingUserId: string,
    userToFollowId: string
  ): Promise<Result> => {
    try {
      const followingUser: UserDoc = await this._userRepository.getById(
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

      const userToFollow: UserDoc = await this._userRepository.getById(
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

        await this._userRepository.unfollowUser(
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
      if (
        // Check if the user has already sent a follow request

        userToFollow.followRequests.includes(
          followingUser._id as mongoose.Schema.Types.ObjectId
        )
      ) {
        // If yes, cancel the follow request
        await this._userRepository.deleteFollowRequest(
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

        await this._userRepository.sendFollowRequest(
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
  };

  handleFollowRequest = async (
    followingUserId: string,
    followRequestId: string,
    followResponse: boolean
  ): Promise<Result> => {
    try {
      const user: UserDoc = await this._userRepository.getById(followingUserId);
      if (!user) {
        const result: Result = {
          statusCode: 404,
          message: "User not found!",
          success: false,
        };
        return result;
      }

      const followerUser: UserDoc = await this._userRepository.getById(
        followRequestId
      );

      // Check 1: if the user to follow exists
      if (!followerUser) {
        const result: Result = {
          statusCode: 404,
          message: "User to follow not found!",
          success: false,
        };
        return result;
      }

      // Check 2: if the user has a follow request from the follower user
      if (!user.followRequests.includes(followerUser._id)) {
        const result: Result = {
          statusCode: 404,
          message: "No follow request found!",
          success: false,
        };
        return result;
      }

      // Check 3: if the user is already following the follower user
      if (user.followers.includes(followerUser._id)) {
        const result: Result = {
          statusCode: 400,
          message: "Follower is already following you!",
          success: false,
        };
        return result;
      }

      // Check 4: if the following user is already following the user
      if (followerUser.following.includes(user._id)) {
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

        await this._userRepository.acceptFollowRequest(user, followerUser);
        const result: Result = {
          statusCode: 200,
          message: "Follow request accepted!",
          success: true,
        };
        return result;
      } else {
        // 2nd case: Decline the follow request
        await this._userRepository.declineFollowRequest(user, followerUser);

        const result: Result = {
          statusCode: 200,
          message: "Follow request declined!",
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
  };

  // TODO: Global exception handling
  updateProfile = async (
    userId: string,
    userForUpdate: UserForUpdate,
    file?
  ): Promise<Result> => {
    try {
      const user: UserDoc = await this._userRepository.getById(userId);

      // Check 1: if the user exists
      if (!user) {
        const result: Result = {
          statusCode: 404,
          message: "User not found!",
          success: false,
        };
        return result;
      }

      const updatedUser: UserDoc = await this._userRepository.update(
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
  };
}
