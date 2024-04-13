import { NextFunction, Response } from "express";
import Request from "../types/Request";
import { isValid } from "../util/validationHandler";
import UserForRegister from "../models/dtos/user/user-for-register";
import * as nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { CustomError } from "../types/error/CustomError";
import UserForLogin from "../models/dtos/user/user-for-login";
import { UserDoc } from "../models/mongoose/UserDoc";
import { UserRepository } from "../repositories/user-repository";
import UserForCreate from "../models/dtos/user/user-for-create";
import { Result } from "../types/result/Result";
import { DataResult } from "../types/result/DataResult";

const transporter: nodemailer.Transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.VERFICATION_SERVICE_EMAIL,
    pass: process.env.VERFICATION_SERVICE_PASSWORD,
  },
});

export class AuthService {
  _userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this._userRepository = userRepository;
  }
  register = async (userToRegister: UserForRegister): Promise<Result> => {
    // TODO: profile picture addition will be on the update profile part
    // const profilePicture: string = req.file
    //   ? "/media/profilePictures/" + req.file.filename
    //   : null;

    try {
      // Check the age of the user whether it is older than 18 or not (using birthDate)
      const age =
        new Date(Date.now()).getFullYear() -
        new Date(userToRegister.birthDate).getFullYear();

      if (age < 18) {
        const result: Result = {
          statusCode: 400,
          message: "You must be 18 years old",
          success: false,
        };

        return result;
      }
      // Checking e-mail whether it exists.
      const userToCheck = await this._userRepository.getByEmail(
        userToRegister.email
      );

      if (userToCheck !== null) {
        const result: Result = {
          statusCode: 409,
          message: "User already exists",
          success: false,
        };

        return result;
      }

      const hashedPassword = await bcrypt.hash(userToRegister.password, 10);

      const userToCreate: UserForCreate = {
        ...userToRegister,
        password: hashedPassword,
      };

      const createdUser: UserDoc = await this._userRepository.create(
        userToCreate
      );

      const result: Result = {
        statusCode: 201,
        message: "User registered successfully",
        success: true,
      };

      return result;
    } catch (err) {
      const error: CustomError = new Error(err.message);
      error.statusCode = 500; // Internal Server Error
      throw error;
    }
  };

  login = async (userToLogin: UserForLogin): Promise<DataResult<String>> => {
    try {
      const user: UserDoc = await this._userRepository.getByEmail(
        userToLogin.email
      );
      if (!user) {
        const result: DataResult<String> = {
          statusCode: 404,
          message: "Email or password is incorrect",
          success: false,
        };
        return result;
      }

      const isEqual = await bcrypt.compare(userToLogin.password, user.password);

      if (!isEqual) {
        const result: DataResult<String> = {
          statusCode: 401,
          message: "Email or password is incorrect",
          success: false,
        };
        return result;
      }

      if (!user.status.emailVerification) {
        const result: DataResult<String> = {
          statusCode: 400,
          message: "Email is not verified! You must verify your email!!",
          success: false,
        };
        return result;
      }

      const token = await this._userRepository.generateJsonWebToken(user._id);

      const result: DataResult<String> = {
        statusCode: 200,
        message: "Token generated",
        data: token,
        success: true,
      };
      return result;
    } catch (err) {
      const error: CustomError = new Error(err.message);
      error.statusCode = err.statusCode || 500;
      throw error;
    }
  };

  verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    const email: string = req.body.email;
    const verificationToken: string = req.body.verificationToken;

    const user: UserDoc = await this._userRepository.getByEmail(email);

    if (!user) {
      const error: CustomError = new Error("User not found");
      error.statusCode = 404; // Not Found
      throw error;
    }

    // const decodedToken: any = jwt.verify(
    //   verificationToken,
    //   process.env.JWT_SECRET
    // );

    // if (decodedToken.email !== email) {
    //   const error: CustomError = new Error("Invalid token");
    //   error.statusCode = 400; // Bad Request
    //   throw error;
    // }

    let message: string;
    // if (decodedToken.verificationType === "personal") {
    //   // TODO: send verification link to the user's student email if this is from personal email
    user.status.emailVerification = true;
    this._userRepository.update(user._id, user);
    message = "Personal mail verified! Please verify your student mail";
    // }

    // if (decodedToken.verificationType === "student") {
    //   user.status.studentVerification = true;
    //   this._userRepository.update(user._id, user);
    //   message = "Student mail verified!";
    // }
    return res.status(200).json({ message: message });
  };

  sendVerificationEmail = async (email: string, verificationType: string) => {
    // TODO: Implement this function
    // send verification link to the user's email

    const user: UserDoc = await this._userRepository.getByEmail(email);

    const verificationToken =
      await this._userRepository.generateVerificationToken(
        user._id,
        user.email,
        verificationType
      );
    // TODO: send verification link to the user's email
    // const verificationLink = `http://yourwebsite.com/verify-email?token=${verificationToken}`;
  };
}
