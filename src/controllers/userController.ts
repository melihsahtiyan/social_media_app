import "reflect-metadata";
import { inject, injectable } from "inversify";
import { UserService } from "../services/userService";
import TYPES from "../util/ioc/types";
import Request from "../types/Request";
import { Response, NextFunction } from "express";
import { isValid } from "../util/validationHandler";
import { Result } from "../types/result/Result";
import isAuth from "../middleware/is-auth";
import { UserForUpdate } from "../models/dtos/user/user-for-update";
import { DataResult } from "../types/result/DataResult";
import { UserDoc } from "../models/schemas/user.schema";

@injectable()
export class UserController {
  public userService: UserService;

  constructor(@inject(UserService) userService: UserService) {
    this.userService = userService;
  }

  async followUser(req: Request, res: Response, next: NextFunction) {
    isValid(req, next);

    try {
      const userToFollow: string = req.body.userId;
      const followingUser: string = req.userId;

      const result: Result = await this.userService.followUser(
        userToFollow,
        followingUser
      );

      if (result.success)
        return res.status(200).json({
          message: result.message,
        });

      return res.status(result.statusCode).json({ result });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async handleFollowRequest(req: Request, res: Response, next: NextFunction) {
    isValid(req, next);

    try {
      const userToFollowId: string = req.userId;
      const followingUserId: string = req.body.userId;
      const followResponse: boolean = req.body.followResponse;

      const result: Result = await this.userService.handleFollowRequest(
        userToFollowId,
        followingUserId,
        followResponse
      );

      if (result.success)
        return res.status(200).json({
          message: result.message,
        });

      return res.status(result.statusCode).json({ result });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("====================================");
      console.log("Controller: ");
      console.log(typeof this.userService);
      console.log(this.userService);
      console.log("====================================");
      console.log(this);
      console.log("====================================");

      const result: DataResult<Array<UserDoc>> =
        await this.userService.getAllUsers();

      if (result.success)
        return res.status(200).json({
          message: "Users fetched successfully",
          data: result.data,
        });

      return res.status(result.statusCode).json({ result });
    } catch (err) {
      // console.log(err);
      next(err);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    isValid(req, next);
    isAuth(req, res, next);
    const userForUpdate: UserForUpdate = req.body;

    const result: Result = await this.userService.updateProfile(
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
