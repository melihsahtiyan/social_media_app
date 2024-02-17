import { NextFunction, Response } from "express";
import Request from "./../types/Request";
import { CustomError } from "../types/error/CustomError";
import User, { IUser } from "../models/User";
import SchemaTypes from "mongoose";
import { isValid } from "../util/validationHandler";

export const followUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  isValid(req, next);
  const userId = req.body.userId;

  try {
    const userToFollow: IUser = await User.findById(userId);
    if (!userToFollow) {
      const error: CustomError = new Error("User to follow not found!");
      error.statusCode = 404;
      throw error;
    }

    const followingUser: IUser = await User.findById(req.userId);
    if (!followingUser) {
      const error: CustomError = new Error("Following user not found!");
      error.statusCode = 404;
      throw error;
    }

    let message: string;
    if (
      followingUser.following.includes(userToFollow._id as SchemaTypes.ObjectId)
    ) {
      userToFollow.followers.filter(
        (follower) => follower !== followingUser._id
      );
      followingUser.following.filter(
        (followed) => followed !== userToFollow._id
      );
      message = "User unfollowed!";
    } else {
      userToFollow.followRequests.push(followingUser._id);

      message = "User follow request sent!";
    }

    await followingUser.save();
    await userToFollow.save();

    res.status(200).json({ message: message });
  } catch (err) {
    err.message = err.message + "\nFollowing user failed";
    next(err);
  }
};

export const handleFollowRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const followResponse: boolean = req.body.followResponse;

  try {
    const user: IUser = await User.findById(req.userId);
    if (!user) {
      const error: CustomError = new Error("User not found!");
      error.statusCode = 404;
      throw error;
    }

    const followingUser: IUser = await User.findById(req.body.userId);
    if (!followingUser) {
      const error: CustomError = new Error("User to follow not found!");
      error.statusCode = 404;
      throw error;
    }

    if (
      !user.followRequests.includes(followingUser._id as SchemaTypes.ObjectId)
    ) {
      const error: CustomError = new Error("No follow request found!");
      error.statusCode = 404;
      throw error;
    }

    if (followResponse) {
      user.following.push(followingUser._id as SchemaTypes.ObjectId);
      followingUser.followers.push(user._id as SchemaTypes.ObjectId);
    }

    user.followRequests.filter(
      (followRequest) => followRequest !== followingUser._id
    );

    await user.save();
    await followingUser.save();

    res.status(200).json({ message: "Follow request handled!" });
  } catch (err) {
    const error: CustomError = new Error(
      err.message || "Handle follow request failed"
    );
    error.statusCode = 500;
    next(err);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
