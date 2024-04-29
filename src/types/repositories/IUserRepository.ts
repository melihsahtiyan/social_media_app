import mongoose from "mongoose";
import UserForCreate from "../../models/dtos/user/user-for-create";
import { UserForUpdate } from "../../models/dtos/user/user-for-update";
import { UserDoc } from "../../models/schemas/user.schema";
import { UserDetailDto } from "src/models/dtos/user/user-detail-dto";

interface IUserRepository {
  create(userForCreate: UserForCreate): Promise<UserDoc>;

  getAll(): Promise<UserDoc[]>;
  getAllPopulated(): Promise<UserDetailDto[]>;

  getById(id: string): Promise<UserDoc>;

  getByEmail(email: string): Promise<UserDoc | null>;

  update(id: string, user: UserForUpdate): Promise<UserDoc>;

  updateStatus(
    id: string,
    { studentVerification, emailVerification }
  ): Promise<UserDoc>;

  delete(id: string): Promise<UserDoc>;

  deleteFriendRequest(
    userToFollowId: mongoose.Schema.Types.ObjectId,
    followerId: mongoose.Schema.Types.ObjectId
  ): Promise<UserDoc>;

  acceptFriendRequest(
    userToFollow: UserDoc,
    followerUser: UserDoc
  ): Promise<UserDoc>;

  rejectFriendRequest(
    userToFollow: UserDoc,
    followerUser: UserDoc
  ): Promise<UserDoc>;

  removeFriend(userToUnfollowId: string, followerId: string): Promise<UserDoc>;

  generateJsonWebToken(id: string): Promise<string>;

  generateVerificationToken(
    id: string,
    email: string,
    emailType: string
  ): Promise<string>;
}

export default IUserRepository;
