import { NextFunction, Response } from "express";
import Request from "../types/Request";
import { isValid } from "../util/validationHandler";
import UserForRegister from "../types/dtos/user/user-for-register";
import * as nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { CustomError } from "../types/error/CustomError";
import UserForLogin from "../types/dtos/user/user-for-login";
import { UserDoc, users } from "../models/User";
import { UserRepository } from "../repositories/user-repository";
import UserForCreate from "../types/dtos/user/user-for-create";
import jwt from "jsonwebtoken";

const transporter: nodemailer.Transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.VERFICATION_SERVICE_EMAIL,
    pass: process.env.VERFICATION_SERVICE_PASSWORD,
  },
});

export class authService {
  _userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this._userRepository = userRepository;
  }
  register = async (req: Request, res: Response, next: NextFunction) => {
    isValid(req, next);
    const userToRegister: UserForRegister = req.body;

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
        const error: CustomError = new Error("You must be 18 years old");
        error.statusCode = 400; // Bad Request
        throw error;
      }
      // Checking e-mail whether it exists.
      const userToCheck = await this._userRepository.getByEmail(
        userToRegister.email
      );

      if (userToCheck !== null) {
        const error: CustomError = new Error("User already exists");
        error.statusCode = 409; // Conflict
        throw error;
      }

      const hashedPassword = await bcrypt.hash(userToRegister.password, 10);

      const userToCreate: UserForCreate = {
        ...userToRegister,
        password: hashedPassword,
      };

      const user = this._userRepository.create(userToCreate);

      return res.status(201).json({ message: "User created" });
    } catch (err) {
      const error: CustomError = new Error(err.message);
      error.statusCode = 500; // Internal Server Error
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    isValid(req, next);
    const userToLogin: UserForLogin = req.body;

    try {
      const user: UserDoc = await this._userRepository.getByEmail(
        userToLogin.email
      );
      if (!user) {
        const error: CustomError = new Error("Email or password is incorrect");
        error.statusCode = 404; // Not Found
        throw error;
      }

      const isEqual = await bcrypt.compare(userToLogin.password, user.password);

      if (!isEqual) {
        const error: CustomError = new Error("Email or password is incorrect");
        error.statusCode = 401; // Unauthorized
        throw error;
      }

      if (!user.status.emailVerification) {
        const error: CustomError = new Error(
          "Email is not verified! You must verify your email!!"
        );
        error.statusCode = 400; // Bad Request
        throw error;
      }

      const token = await this._userRepository.generateJsonWebToken(user._id);

      return res.status(200).json({ message: "Token generated", token });
    } catch (err) {
      const error: CustomError = new Error(err.message);
      error.statusCode = err.statusCode || 500;
      next(error);
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
