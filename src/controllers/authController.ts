import { NextFunction, Request, Response } from "express";
import { isValid } from "../util/validationHandler";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { CustomError } from "./../types/error/CustomError";
import nodemailer from "nodemailer";

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

  const {
    firstName,
    lastName,
    password,
    email,
    birthDate,
    profilePicture,
    university,
    department,
    studentId,
    studentEmail,
  }: UserForRegisterDto = req.body;

  // Checking e-mail whether it exists.
  const userToCheck = User.findOne({ email });

  if (userToCheck) {
    const error: CustomError = new Error("User already exists");
    error.statusCode = 409;
    throw error;
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        firstName,
        lastName,
        passwordHash: hashedPassword,
        email,
        birthDate,
        profilePicture,
        university,
        department,
        studentId,
        studentEmail,
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Verification email",
        text: "Please click the link to verify your account",
        // html: `<a href="http://localhost:3000/verify/${user._id}">Verify</a>`,
        html: `<a href="https://www.google.com">Verify</a>`,
      };

      //sending the email to the personal email
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          const error: CustomError = new Error(err.message);
          error.message = err.message;
          error.statusCode = 503; // Service unavailable
          throw error;
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      //sending the email to the student email
      mailOptions.to = studentEmail;

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
      res
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
