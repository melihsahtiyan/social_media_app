import "reflect-metadata";
import { injectable } from "inversify";
import mongoose from "mongoose";
import { UserDoc, users } from "../models/schemas/user.schema";
import UserForCreate from "../models/dtos/user/user-for-create";
import { UserForUpdate } from "../models/dtos/user/user-for-update";
import jwt from "jsonwebtoken";
import IUserRepository from "../types/repositories/IUserRepository";

@injectable()
export class UserRepository implements IUserRepository {
  constructor() {}

  async create(userForCreate: UserForCreate): Promise<UserDoc> {
    return await users.create({
      ...userForCreate,
      followers: [],
      following: [],
      posts: [],
    });
  }

  async getAll(): Promise<UserDoc[]> {
    return await users.find();
  }

  async getById(id: string): Promise<UserDoc> {
    return (await users.findById(id)) as UserDoc;
  }

  async getByEmail(email: string): Promise<UserDoc | null> {
    return (await users.findOne({ email })) as UserDoc;
  }

  async update(id: string, user: UserForUpdate): Promise<UserDoc> {
    return await users.findByIdAndUpdate(id, { ...user }, { new: true });
  }

  async updateStatus(
    id: string,
    { studentVerification, emailVerification }
  ): Promise<UserDoc> {
    return await users.findByIdAndUpdate(
      id,
      {
        status: {
          studentVerification,
          emailVerification,
        },
      },
      { new: true }
    );
  }

  async delete(id: string): Promise<UserDoc> {
    return await users.findByIdAndDelete(id);
  }

  async sendFollowRequest(
    userToFollowId: mongoose.Schema.Types.ObjectId,
    followingUserId: mongoose.Schema.Types.ObjectId
  ): Promise<UserDoc> {
    const userToFollow: UserDoc = (await users.findById(
      userToFollowId
    )) as UserDoc;

    // Push the followerId to the followRequests array of the userToFollow
    userToFollow.followRequests.push(followingUserId);
    return await userToFollow.save();
  }

  async deleteFollowRequest(
    userToFollowId: mongoose.Schema.Types.ObjectId,
    followerId: mongoose.Schema.Types.ObjectId
  ): Promise<Boolean> {
    const userToFollow: UserDoc = (await users.findById(
      userToFollowId
    )) as UserDoc;

    userToFollow.followRequests = userToFollow.followRequests.filter(
      (request) => request.toString() !== followerId.toString()
    );

    return true;
  }

  async acceptFollowRequest(
    userToFollow: UserDoc,
    followerUser: UserDoc
  ): Promise<UserDoc> {
    if (userToFollow.followRequests.includes(followerUser._id)) {
      this.deleteFollowRequest(userToFollow._id, followerUser._id);

      userToFollow.followers.push(
        followerUser._id as mongoose.Schema.Types.ObjectId
      );

      await userToFollow.save();

      followerUser.following.push(
        userToFollow._id as mongoose.Schema.Types.ObjectId
      );
    }

    console.log("====================================");
    console.log("User to follow: ", {
      followers: userToFollow.followers,
      followRequests: userToFollow.followRequests,
    });
    console.log("====================================");

    return await followerUser.save();
  }

  async rejectFollowRequest(
    userToFollow: UserDoc,
    followerUser: UserDoc
  ): Promise<UserDoc> {
    if (userToFollow.followRequests.includes(followerUser._id)) {
      this.deleteFollowRequest(userToFollow._id, followerUser._id);
    }

    await userToFollow.save();
    return await followerUser.save();
  }

  async unfollowUser(
    userToUnfollowId: string,
    followerId: string
  ): Promise<UserDoc> {
    const userToUnfollow: UserDoc = await users.findById(userToUnfollowId);
    const followerUser: UserDoc = await users.findById(followerId);

    userToUnfollow.followers = userToUnfollow.followers.filter(
      (follower: mongoose.Schema.Types.ObjectId) =>
        follower.toString() !== followerUser._id.toString()
    );

    followerUser.following = followerUser.following.filter(
      (following: mongoose.Schema.Types.ObjectId) =>
        following.toString() !== userToUnfollow._id.toString()
    );

    await userToUnfollow.save();
    return await followerUser.save();
  }

  async generateJsonWebToken(id: string): Promise<string> {
    const user: UserDoc = await users.findById(id);
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.SECRET_KEY
    );
    return token;
  }

  async generateVerificationToken(
    id: string,
    email: string,
    emailType: string
  ): Promise<string> {
    const token = jwt.sign(
      {
        _id: id,
        email,
        emailType,
      },
      process.env.SECRET_KEY, // TODO change this to a more secure key
      { expiresIn: "7d" }
    );

    return token;
  }
}
