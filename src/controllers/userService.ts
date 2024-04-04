import { NextFunction, Response } from "express";
import Request from "../types/Request";
import { CustomError } from "../types/error/CustomError";
import { UserDoc } from "../models/User";
import SchemaTypes from "mongoose";
import { isValid } from "../util/validationHandler";
import { UserRepository } from "../repositories/user-repository";
import mongoose from "mongoose";

export class UserService {
  _userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this._userRepository = userRepository;
  }
  followUser = async (req: Request, res: Response, next: NextFunction) => {
    isValid(req, next);
    const userId: string = req.body.userId;

    try {
      const followingUser: UserDoc = await this._userRepository.getById(
        req.userId
      );

      if (!followingUser) {
        const error: CustomError = new Error("You must be logged in!");
        error.statusCode = 404;
        throw error;
      }

      const userToFollow: UserDoc = await this._userRepository.getById(userId);
      if (!userToFollow) {
        const error: CustomError = new Error("User to follow not found!");
        error.statusCode = 404;
        throw error;
      }

      // if (
      //   // Check if the user is already following the user
      //   followingUser.following.includes(
      //     userToFollow._id as SchemaTypes.ObjectId
      //   )
      // ) {
      //   this._userRepository.unfollowUser(userToFollow._id, followingUser._id);
      //   message = "User unfollowed!";
      // }

      if (
        // Check if the user has already sent a follow request

        userToFollow.followRequests.includes(
          followingUser._id as mongoose.Schema.Types.ObjectId
        )
      ) {
        // If yes, cancel the follow request
        userToFollow.followRequests = userToFollow.followRequests.filter(
          (id) => id.toString() !== followingUser._id.toString()
        );
        await this._userRepository.update(userToFollow._id, userToFollow);

        res.status(200).json({ message: "Follow request cancelled!" });
      } else {
        // If not, send a follow request

        await this._userRepository.sendFollowRequest(
          userToFollow._id,
          followingUser._id
        );

        res.status(200).json({ message: "User follow request sent!" });
      }
    } catch (err) {
      err.message = err.message + "\nFollowing user failed";
      next(err);
    }
  };

  handleFollowRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    isValid(req, next);
    const followResponse: boolean = req.body.followResponse;
    const followRequestId: string = req.body.userId;

    try {
      const user: UserDoc = await this._userRepository.getById(req.userId);
      if (!user) {
        const error: CustomError = new Error("User not found!");
        error.statusCode = 404;
        throw error;
      }

      const followerUser: UserDoc = await this._userRepository.getById(
        followRequestId
      );

      // Check 1: if the user to follow exists
      if (!followerUser) {
        const error: CustomError = new Error("User to follow not found!");
        error.statusCode = 404;
        throw error;
      }

      // Check 2: if the user has a follow request from the follower user
      if (!user.followRequests.includes(followerUser._id)) {
        const error: CustomError = new Error("No follow request found!");
        error.statusCode = 404;
        throw error;
      }

      // Check 3: if the user is already following the follower user
      if (user.followers.includes(followerUser._id)) {
        const error: CustomError = new Error(
          "Follower is already following you!"
        );
        error.statusCode = 400;
        throw error;
      }

      // Check 4: if the following user is already following the user
      if (followerUser.following.includes(user._id)) {
        const error: CustomError = new Error("User is already following you!");
        error.statusCode = 400;
        throw error;
      }

      // Handle the follow request
      // Possible cases: Accept or Decline
      if (followResponse) {
        // 1st case: Accept the follow request

        await this._userRepository.acceptFollowRequest(user, followerUser);

        return res.status(200).json({ message: "Follow request accepted!" });
      } else {
        // 2nd case: Decline the follow request

        await this._userRepository.declineFollowRequest(user, followerUser);

        return res.status(200).json({ message: "Follow request declined!" });
      }
    } catch (err) {
      const error: CustomError = new Error(
        err.message || "Handle follow request failed"
      );
      error.statusCode = 500;
      next(err);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {};
}
