import { UserDoc } from "../../models/schemas/user.schema";
import { DataResult } from "../result/DataResult";
import { Result } from "./../result/Result";
import { UserForUpdate } from "../../models/dtos/user/user-for-update";
import { UserDetailDto } from "../../models/dtos/user/user-detail-dto";
import { UserListDto } from "../../models/dtos/user/user-list-dto";
import { UserForSearchDto } from "../../models/dtos/user/user-for-search-dto";

interface IUserService {
  getAllUsers(): Promise<DataResult<Array<UserListDto>>>;
  getUserById(userId: string): Promise<DataResult<UserDoc>>;
  searchByName(
    name: string,
    userId: string
  ): Promise<DataResult<Array<UserForSearchDto>>>;
  viewUserDetails(
    userId: string,
    viewerId: string
  ): Promise<DataResult<UserDetailDto>>;
  getAllDetails(): Promise<DataResult<Array<UserDetailDto>>>;

  sendFriendRequest(
    followingUserId: string,
    userToFollowId: string
  ): Promise<Result>;

  handleFollowRequest(
    followingUserId: string,
    followRequestId: string,
    followResponse: boolean
  ): Promise<Result>;

  unfriend(followingUserId: string, userToUnfollowId: string): Promise<Result>;

  updateProfile(
    userId: string,
    userForUpdate: UserForUpdate,
    file?: Express.Multer.File
  ): Promise<Result>;

  changeProfilePhoto(
    userId: string,
    file: Express.Multer.File
  ): Promise<Result>;

  deleteProfilePhoto(userId: string): Promise<Result>;
}

export default IUserService;
