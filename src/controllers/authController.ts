import "reflect-metadata";
import { inject } from "inversify";
import { controller } from "inversify-express-utils";
import { AuthService } from "./../services/authService";
import TYPES from "./../util/ioc/types";
import Request from "./../types/Request";
import { NextFunction, Response } from "express";
import { isValid } from "./../util/validationHandler";
import UserForRegister from "./../models/dtos/user/user-for-register";
import { Result } from "./../types/result/Result";
import UserForLogin from "./../models/dtos/user/user-for-login";
import { DataResult } from "./../types/result/DataResult";

@controller("/auth")
export class AuthController {
  private _authService: AuthService;

  constructor(@inject(AuthService) authService: AuthService) {
    this._authService = authService;
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      isValid(req, res, next);
      const userToRegister: UserForRegister = req.body;

      const result: Result = await this._authService.register(userToRegister);

      if (result.success)
        return res.status(result.statusCode).json({
          message: result.message,
        });

      return res.status(result.statusCode).json({ result });
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      isValid(req, res, next);
      const userToLogin: UserForLogin = req.body;

      const result: DataResult<String> = await this._authService.login(
        userToLogin
      );

      if (result.success)
        return res.status(200).json({
          message: "Token generated",
          token: result.data,
        });

      return res.status(result.statusCode).json({ result });
    } catch (err) {
      next(err);
    }
  }
}
