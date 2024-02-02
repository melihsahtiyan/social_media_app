import { NextFunction, Response } from "express";
import Request from "../types/Request";
import { isValid } from "../util/validationHandler";
import UserForRegisterDto from "../types/dtos/user/userForRegisterDto";
import * as nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import User, { UserDoc } from "../models/User";
import { CustomError } from "../types/error/CustomError";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  isValid(req, next);

  const userToRegister: UserForRegisterDto = req.body;

  // Check the profile picture whether it exists or not
  const profilePicture: string = req.files[0].path === undefined ? null : req.files[0].path;

  // Check the file type of the profile picture
  const fileExtensions: string[] = ["jpg", "jpeg", "png"];

  if (fileExtensions.includes(profilePicture.split(".")[1]) === false) {
    const error: CustomError = new Error("Invalid file type");
    error.statusCode = 400;
    next(error);
  }

  // Check the age of the user whether it is older than 18 or not
  const birthYear = new Date(userToRegister.birthDate).getFullYear();
  if (Date.now() - birthYear < 18) {
    const error: CustomError = new Error("You must be 18 years old");
    error.statusCode = 400;
    next(error);
  }

  // Checking e-mail whether it exists.
  const userToCheck = User.findOne({ email: userToRegister.email });

  if (userToCheck !== null) {
    const error: CustomError = new Error("User already exists");
    error.statusCode = 409;
    next(error);
  }

  bcrypt
    .hash(userToRegister.password, 12)
    .then((hashedPassword) => {
      const user = new User({...userToRegister, passwordHash: hashedPassword, profilePicture});

      const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: "Verification email",
        text: "Please click the link to verify your account",
        html: `<a href="https://www.google.com">Verify</a>`,
        // TODO: Change the link. Don't forget the mail type (student or personal)
      };

      //sending the email to the personal email
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          const error: CustomError = new Error(err.message);
          error.message = err.message;
          error.statusCode = 503; // Service unavailable
          next(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      //sending the email to the student email
      mailOptions.to = user.studentEmail;

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      return user.save();
    })
    .then((user) => {
      return res
        .status(201)
        .json({ message: "User created. Verification mail sent", user });
    })
    .catch((err) => next(err));
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email: string = req.body.email;
  const mailType: string = req.body.mailType;

  const user: UserDoc = await User.findOne({ email });

  if (!user) {
    const error: CustomError = new Error("User not found");
    error.statusCode = 404;
    next(error);
  }

  if (
    // To check whether the user is already verified or not
    (user.status.emailVerification && mailType === "personal") ||
    (user.status.studentVerification && mailType === "student")
  ) {
    const error: CustomError = new Error("User already verified");
    error.statusCode = 400;
    next(error);
  }

  if (mailType === "personal") {
    user.status.emailVerification = true;
  } else {
    user.status.studentVerification = true;
  }

  user.save().catch((err) => next(err));

  return res.status(200).json({ message: "User verified" });
};
