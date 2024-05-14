import "reflect-metadata";
import { injectable } from "inversify";
import mongoose from "mongoose";
import { UserDoc, users } from "../models/schemas/user.schema";
import UserForCreate from "../models/dtos/user/user-for-create";
import { UserDetailDto } from "../models/dtos/user/user-detail-dto";
import { UserForUpdate } from "../models/dtos/user/user-for-update";
import jwt from "jsonwebtoken";
import IUserRepository from "../types/repositories/IUserRepository";
import { CustomError } from "../types/error/CustomError";
import { User } from "../models/entites/User";
import { posts } from "../models/schemas/post.schema";
import { PostDetails } from "../models/dtos/post/post-details";

@injectable()
export class UserRepository implements IUserRepository {
  constructor() {}
  async searchByName(name: string): Promise<Array<UserDoc>> {
    const usersByName: Array<UserDoc> = await users
      .aggregate()
      .project({ fullName: { $concat: ["$firstName", " ", "$lastName"] } })
      .match({ fullName: { $regex: name, $options: "i" } })
      .sort({ fullName: 1 })
      .exec();

    return usersByName;
  }

  async create(userForCreate: UserForCreate): Promise<UserDoc> {
    return await users.create({
      ...userForCreate,
      friends: [],
      following: [],
      posts: [],
    });
  }

  async getUserDetails(id: string): Promise<UserDetailDto> {
    const user: User = await users
      .findById(id)
      .populate("friends", "_id firstName lastName")
      .exec();

    if (!user) {
      const error: CustomError = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const userPosts: PostDetails[] = (await posts.find({
      creator: user._id,
    })) as PostDetails[];

    const userDetail: UserDetailDto = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePhotoUrl: user.profilePhotoUrl,
      university: user.university,
      department: user.department,
      friends: [],
      friendCount: user.friends.length,
      friendRequests: [],
      posts: [],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    if (user.friends.length > 0) {
      userDetail.friends = await Promise.all(
        user.friends.map(async (followerId) => {
          const follower: UserDoc = await users.findById(followerId);
          return {
            _id: follower._id.toString(),
            firstName: follower.firstName,
            lastName: follower.lastName,
          };
        })
      );
    }

    if (user.friendRequests.length > 0) {
      userDetail.friendRequests = await Promise.all(
        user.friendRequests.map(async (requestId) => {
          const request: UserDoc = await users.findById(requestId);
          return {
            _id: request._id.toString(),
            firstName: request.firstName,
            lastName: request.lastName,
          };
        })
      );
    }

    userDetail.posts = userPosts
      .map((post) => {
        const postDetail: PostDetails = {
          _id: post._id,
          creator: post.creator,
          poll: post.poll,
          content: post.content,
          createdAt: post.createdAt,
          comments: post.comments,
          likes: post.likes,
          commentCount: post.comments.length,
          likeCount: post.likes.length,
          isUpdated: post.isUpdated,
          isLiked: false,
        };

        return postDetail;
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return await Promise.resolve<UserDetailDto>(userDetail);
  }

  async getAll(): Promise<UserDoc[]> {
    return await users.find();
  }

  async getAllPopulated(): Promise<UserDetailDto[]> {
    const allUsers = await users.find();

    const detailedUsers: UserDetailDto[] = await Promise.all(
      allUsers.map(async (user: UserDoc) => {
        const userPosts = (await posts.find({
          creator: user._id,
        })) as PostDetails[];
        const detailedUser: UserDetailDto = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profilePhotoUrl: user.profilePhotoUrl,
          university: user.university,
          department: user.department,
          friends: [],
          friendCount: user.friends.length,
          friendRequests: [],
          posts: userPosts,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };

        if (user.friends.length > 0) {
          detailedUser.friends = await Promise.all(
            user.friends.map(async (followerId) => {
              const follower: UserDoc = await users.findById(followerId);
              return {
                _id: follower._id.toString(),
                firstName: follower.firstName,
                lastName: follower.lastName,
              };
            })
          );
        }

        if (user.friendRequests.length > 0) {
          detailedUser.friendRequests = await Promise.all(
            user.friendRequests.map(async (requestId) => {
              const request: UserDoc = await users.findById(requestId);
              return {
                _id: request._id.toString(),
                firstName: request.firstName,
                lastName: request.lastName,
              };
            })
          );
        }

        return detailedUser as UserDetailDto;
      })
    );

    return await Promise.resolve<UserDetailDto[]>(detailedUsers);
  }

  async getById(id: string): Promise<UserDoc> {
    const user: UserDoc = await users.findById(id).populate("posts");
    return user;
  }

  async getByEmail(email: string): Promise<User> {
    return (await users.findOne({ email: email })) as User;
  }

  async update(id: string, user: UserForUpdate): Promise<UserDoc> {
    return await users.findByIdAndUpdate(id, { ...user }, { new: true });
  }

  async updateprofilePhoto(
    id: string,
    profilePhotoUrl: string
  ): Promise<UserDoc> {
    return await users.findByIdAndUpdate(
      id,
      { profilePhotoUrl: profilePhotoUrl },
      { new: true }
    );
  }

  async deleteProfilePhoto(id: string): Promise<UserDoc> {
    return await users.findByIdAndUpdate(
      id,
      { profilePhotoUrl: null },
      { new: true }
    );
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

  async sendFriendRequest(
    userToFollowId: mongoose.Schema.Types.ObjectId,
    followingUserId: mongoose.Schema.Types.ObjectId
  ): Promise<UserDoc> {
    const userToFollow: UserDoc = (await users.findById(
      userToFollowId
    )) as UserDoc;

    // Push the followerId to the followRequests array of the userToFollow
    userToFollow.friendRequests.push(followingUserId);
    return await userToFollow.save();
  }

  async deleteFriendRequest(
    receiverUserId: mongoose.Schema.Types.ObjectId,
    senderUserId: mongoose.Schema.Types.ObjectId
  ): Promise<UserDoc> {
    try {
      const receiverUser: UserDoc = (await users.findById(
        receiverUserId
      )) as UserDoc;

      receiverUser.friendRequests = receiverUser.friendRequests.filter(
        (request) => request.toString() !== senderUserId.toString()
      );

      return await receiverUser.save();
    } catch (err) {
      const error: CustomError = err;
      throw error;
    }
  }

  async acceptFriendRequest(
    receiverUser: UserDoc,
    senderUser: UserDoc
  ): Promise<UserDoc> {
    if (receiverUser.friendRequests.includes(senderUser._id)) {
      await this.deleteFriendRequest(receiverUser._id, senderUser._id);

      receiverUser.friends.push(
        senderUser._id as mongoose.Schema.Types.ObjectId
      );

      await receiverUser.save();

      senderUser.friends.push(
        receiverUser._id as mongoose.Schema.Types.ObjectId
      );
    }

    return await senderUser.save();
  }

  async rejectFriendRequest(
    userToAdd: UserDoc,
    requestedUser: UserDoc
  ): Promise<UserDoc> {
    if (userToAdd.friendRequests.includes(requestedUser._id)) {
      this.deleteFriendRequest(userToAdd._id, requestedUser._id);
    }

    await userToAdd.save();
    return await requestedUser.save();
  }

  async removeFriend(userToRemoveId: string, userId: string): Promise<UserDoc> {
    const userToRemove: UserDoc = await users.findById(userToRemoveId);
    const user: UserDoc = await users.findById(userId);

    userToRemove.friends = userToRemove.friends.filter(
      (friends: mongoose.Schema.Types.ObjectId) =>
        friends.toString() !== user._id.toString()
    );

    user.friends = user.friends.filter(
      (friend: mongoose.Schema.Types.ObjectId) =>
        friend.toString() !== userToRemove._id.toString()
    );

    await userToRemove.save();
    return await user.save();
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
      // { expiresIn: "1h" }
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
