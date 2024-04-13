import { UserService } from "../services/userService";
import { isValid } from "../util/validationHandler";
import { Response, NextFunction } from "express";
import Request from "../types/Request";
import { Result } from "../types/result/Result";
import isAuth from "../middleware/is-auth";
import { UserForUpdate } from "src/models/dtos/user/user-for-update";
import { DataResult } from "src/types/result/DataResult";
import { UserDoc } from "src/models/mongoose/UserDoc";

export class UsersContoller {
  private _userService: UserService;

  constructor(userService: UserService) {
    this._userService = userService;
  }

  async followUser(req: Request, res: Response, next: NextFunction) {
    isValid(req, next);
    const userToFollow: string = req.body.userId;
    const followingUser: string = req.userId;

    const result: Result = await this._userService.followUser(
      userToFollow,
      followingUser
    );

    if (result.success)
      return res.status(200).json({
        message: result.message,
      });

    return res.status(result.statusCode).json({ result });
  }

  async handleFollowRequest(req: Request, res: Response, next: NextFunction) {
    isValid(req, next);
    const followResponse: boolean = req.body.followResponse;
    const followRequestId: string = req.body.userId;
    const followingUserId: string = req.userId;

    const result: Result = await this._userService.handleFollowRequest(
      followingUserId,
      followRequestId,
      followResponse
    );

    if (result.success)
      return res.status(200).json({
        message: result.message,
      });

    return res.status(result.statusCode).json({ result });
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    const result: DataResult<Array<UserDoc>> =
      await this._userService.getAllUsers();

    if (result.success)
      return res.status(200).json({
        message: "Users fetched successfully",
        data: result.data,
      });

    return res.status(result.statusCode).json({ result });
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    isValid(req, next);
    isAuth(req, res, next);
    const userForUpdate: UserForUpdate = req.body;

    const result: Result = await this._userService.updateProfile(
      req.userId,
      userForUpdate
    );

    if (result.success)
      return res.status(200).json({
        message: "Profile updated!",
      });

    return res.status(result.statusCode).json({ result });
  }
}
