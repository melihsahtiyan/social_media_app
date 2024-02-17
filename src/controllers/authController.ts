import { NextFunction, Response } from "express";
import Request from "../types/Request";
import { isValid } from "../util/validationHandler";
import UserForRegisterDto from "../types/dtos/user/userForRegisterDto";
import * as nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import User, { IUser } from "../models/User";
import { CustomError } from "../types/error/CustomError";
import UserForLoginDto from "../types/dtos/user/userForLoginDto";

const transporter: nodemailer.Transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.VERFICATION_SERVICE_EMAIL,
    pass: process.env.VERFICATION_SERVICE_PASSWORD,
  },
});

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  isValid(req, next);
  const userToRegister: UserForRegisterDto = req.body;

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
    const userToCheck = await User.findOne({ email: userToRegister.email });

    if (userToCheck !== null) {
      const error: CustomError = new Error("User already exists");
      error.statusCode = 409; // Conflict
      throw error;
    }

    const hashedPassword = await bcrypt.hash(userToRegister.password, 10);

    const user: IUser = new User({
      ...userToRegister,
      password: hashedPassword,
    });

    user.save();

    return res.status(201).json({ message: "User created" });
  } catch (err) {
    const error: CustomError = new Error(err.message);
    error.statusCode = 500; // Internal Server Error
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  isValid(req, next);
  const userToLogin: UserForLoginDto = req.body;

  try {
    const user: IUser = await User.findOne({ email: userToLogin.email });
    if (!user) {
      const error: CustomError = new Error("Email or password is incorrect");
      error.statusCode = 404; // Not Found
      throw error;
    }

    if (!user.status.emailVerification) {
      const error: CustomError = new Error("Email is not verified");
      error.statusCode = 400; // Bad Request
      throw error;
    }

    const isEqual = await bcrypt.compare(userToLogin.password, user.password);

    if (!isEqual) {
      const error: CustomError = new Error("Email or password is incorrect");
      error.statusCode = 401; // Unauthorized
      throw error;
    }

    const token = user.generateJsonWebToken();

    return res.status(200).json({ message: "Token generated", token });
  } catch (err) {
    const error: CustomError = new Error(err.message);
    error.statusCode = err.statusCode || 500;
    next(error);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email: string = req.body.email;
  const mailType: string = req.body.mailType;

  const user: IUser = await User.findOne({ email });

  if (!user) {
    const error: CustomError = new Error("User not found");
    error.statusCode = 404; // Not Found
    throw error;
  }

  if (
    // To check whether the user is already verified or not
    (user.status.emailVerification && mailType === "personal") ||
    (user.status.studentVerification && mailType === "student")
  ) {
    const error: CustomError = new Error("User already verified");
    error.statusCode = 400; // Bad Request
    throw error;
  }

  if (mailType === "personal") {
    user.status.emailVerification = true;
  }
  if (mailType === "student") {
    user.status.studentVerification = true;
  }

  user.save().catch((err) => next(err));

  return res.status(200).json({ message: "User verified" });
};
