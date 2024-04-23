import mongoose from "mongoose";
import UserForCreate from "../../models/dtos/user/user-for-create";
import { UserForUpdate } from "../../models/dtos/user/user-for-update";
import { UserDoc } from "../../models/schemas/user.schema";

interface IUserRepository {
  create(userForCreate: UserForCreate): Promise<UserDoc>;

  getAll(): Promise<UserDoc[]>;

  getById(id: string): Promise<UserDoc>;

  getByEmail(email: string): Promise<UserDoc | null>;

  update(id: string, user: UserForUpdate): Promise<UserDoc>;

  updateStatus(
    id: string,
    { studentVerification, emailVerification }
  ): Promise<UserDoc>;

  delete(id: string): Promise<UserDoc>;

  deleteFollowRequest(
    userToFollowId: mongoose.Schema.Types.ObjectId,
    followerId: mongoose.Schema.Types.ObjectId
  ): Promise<Boolean>;

  acceptFollowRequest(
    userToFollow: UserDoc,
    followerUser: UserDoc
  ): Promise<UserDoc>;

  rejectFollowRequest(
    userToFollow: UserDoc,
    followerUser: UserDoc
  ): Promise<UserDoc>;

  unfollowUser(userToUnfollowId: string, followerId: string): Promise<UserDoc>;

  generateJsonWebToken(id: string): Promise<string>;

  generateVerificationToken(
    id: string,
    email: string,
    emailType: string
  ): Promise<string>;
}

export default IUserRepository;
