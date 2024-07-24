import mongoose from "mongoose";
import UserForCreate from "../../models/dtos/user/user-for-create";
import { UserForUpdate } from "../../models/dtos/user/user-for-update";
import { UserDoc } from "../../models/schemas/user.schema";
import { UserDetailDto } from "../../models/dtos/user/user-detail-dto";
import { User } from "../../models/entites/User";
import { UserProfileDto } from "../../models/dtos/user/user-profile-dto";
import { UserListDto } from "../../models/dtos/user/user-list-dto";
import { UserForSearchDto } from "../../models/dtos/user/user-for-search-dto";
import { UserForRequestDto } from "../../models/dtos/user/user-for-request-dto";

interface IUserRepository {
  create(userForCreate: UserForCreate): Promise<UserDoc>;
  getUserDetails(id: string): Promise<UserDetailDto>;
  getUserProfile(id: string): Promise<UserProfileDto>;
  getAll(): Promise<Array<UserListDto>>;
  getAllPopulated(): Promise<UserProfileDto[]>;
  getById(id: string): Promise<User>;
  getByEmail(email: string): Promise<User>;
  getUsersByIdsForDetails(
    ids: Array<mongoose.Schema.Types.ObjectId>,
    detailedUser: string
  ): Promise<Array<UserForSearchDto>>;
  searchByName(name: string): Promise<Array<UserForSearchDto>>;
  getAllFriendRequests(id: string): Promise<Array<UserForRequestDto>>;
  update(id: string, user: UserForUpdate): Promise<UserDoc>;
  updateStatus(
    id: string,
    { studentVerification, emailVerification }
  ): Promise<UserDoc>;
  updateprofilePhoto(id: string, profilePhotoUrl: string): Promise<UserDoc>;
  deleteProfilePhoto(id: string): Promise<UserDoc>;

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
  generateVerificationToken(
    id: string,
    email: string,
    emailType: string
  ): Promise<string>;
}

export default IUserRepository;
