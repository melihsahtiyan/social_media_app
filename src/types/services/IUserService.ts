import { UserDoc } from "../../models/schemas/user.schema";
import { DataResult } from "../result/DataResult";
import { Result } from "./../result/Result";
import { UserForUpdate } from "../../models/dtos/user/user-for-update";
import { UserDetailDto } from "../../models/dtos/user/user-detail-dto";

interface IUserService {
  getAllUsers(): Promise<DataResult<Array<UserDoc>>>;

  sendFriendRequest(followingUserId: string, userToFollowId: string): Promise<Result>;

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

  getAllDetails(): Promise<DataResult<Array<UserDetailDto>>>;
}

export default IUserService;
