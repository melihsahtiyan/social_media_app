import { UserDoc } from "../../models/schemas/user.schema";
import { DataResult } from "../result/DataResult";
import { Result } from "./../result/Result";
import { UserForUpdate } from "../../models/dtos/user/user-for-update";

interface IUserService {
  getAllUsers(): Promise<DataResult<Array<UserDoc>>>;

  followUser(followingUserId: string, userToFollowId: string): Promise<Result>;

  handleFollowRequest(
    followingUserId: string,
    followRequestId: string,
    followResponse: boolean
  ): Promise<Result>;

  updateProfile(
    userId: string,
    userForUpdate: UserForUpdate,
    file?: Express.Multer.File
  ): Promise<Result>;
}

export default IUserService;
