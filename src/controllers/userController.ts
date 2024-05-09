import "reflect-metadata";
import { inject, injectable } from "inversify";
import { UserService } from "../services/userService";
import Request from "../types/Request";
import { Response, NextFunction } from "express";
import { isValid } from "../util/validationHandler";
import { Result } from "../types/result/Result";
import isAuth from "../middleware/is-auth";
import { UserForUpdate } from "../models/dtos/user/user-for-update";
import { DataResult } from "../types/result/DataResult";
import { UserDoc } from "../models/schemas/user.schema";
import { UserDetailDto } from "src/models/dtos/user/user-detail-dto";

@injectable()
export class UserController {
  public userService: UserService;

  constructor(@inject(UserService) userService: UserService) {
    this.userService = userService;
  }

  async sendFriendRequest(req: Request, res: Response, next: NextFunction) {
    try {
      isValid(req, res, next);
      const userToFollow: string = req.body.userId;
      const followingUser: string = req.userId;

      const result: Result = await this.userService.sendFriendRequest(
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
    try {
      isValid(req, res, next);
      const receiverUserId: string = req.userId;
      const senderUserId: string = req.body.userId;
      const response: boolean = req.body.response;

      const result: Result = await this.userService.handleFollowRequest(
        receiverUserId,
        senderUserId,
        response
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

  async getAllDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const result: DataResult<Array<UserDetailDto>> =
        await this.userService.getAllDetails();

      if (result.success)
        return res.status(200).json({
          message: "Users fetched successfully",
          data: result.data,
        });

      return res.status(result.statusCode).json({ result });
    } catch (err) {
      next(err);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId: string = req.userId;
      const result: DataResult<UserDoc> = await this.userService.getUserById(
        userId
      );

      if (result.success)
        return res.status(200).json({
          message: result.message,
          data: result.data,
        });

      return res.status(result.statusCode).json({ result });
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      isValid(req, res, next);
      isAuth(req, res, next);
      const userForUpdate: UserForUpdate = req.body;

      const result: Result = await this.userService.updateProfile(
        req.userId,
        userForUpdate
      );

      return res.status(result.statusCode).json({ result });
    } catch (err) {
      next(err);
    }
  }

  async changeProfilePhoto(req: Request, res: Response, next: NextFunction) {
    try {
      isValid(req, res, next);
      const file: Express.Multer.File = req.file;
      const userId: string = req.userId;

      const result: Result = await this.userService.changeProfilePhoto(
        userId,
        file
      );

      return res.status(result.statusCode).json(result);
    } catch (err) {
      next(err);
    }
  }

  async deleteProfilePhoto(req: Request, res: Response, next: NextFunction) {
    try {
      const userId: string = req.userId;

      const result: Result = await this.userService.deleteProfilePhoto(userId);

      return res.status(result.statusCode).json(result);
    } catch (err) {
      next(err);
    }
  }
}
