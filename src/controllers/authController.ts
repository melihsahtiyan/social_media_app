import { Controller } from "tsoa";
import UserForRegister from "../models/dtos/user/user-for-register";
import { NextFunction, Response } from "express";
import { isValid } from "../util/validationHandler";
import Request from "../types/Request";
import { AuthService } from "../services/authService";
import { Result } from "../types/result/Result";
import { DataResult } from "../types/result/DataResult";
import UserForLogin from "src/models/dtos/user/user-for-login";

export class AuthController extends Controller {
  private _authService: AuthService;
  constructor(authService: AuthService) {
    super();
    this._authService = authService;
  }

  async register(req: Request, res: Response, next: NextFunction) {
    isValid(req, next);
    const userToRegister: UserForRegister = req.body;

    const result: Result = await this._authService.register(userToRegister);

    if (result.success)
      return res.status(201).json({
        message: "User registered successfully",
      });

    return res.status(result.statusCode).json({ result });
  }

  async login(req: Request, res: Response, next: NextFunction) {
    isValid(req, next);
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
  }
}
