import express, { NextFunction, Response } from "express";
import Request from "../types/Request";
import { body } from "express-validator";
import { AuthController } from "../controllers/authController";
import container from "../util/ioc/iocContainer";
import { authRequestLogger } from "../util/loggingHandler";

const controller: AuthController =
  container.get<AuthController>(AuthController);

function routes(app: express.Express) {
  app.put(
    "/auth/register",
    [
      body("email").isEmail().withMessage("Email must be valid"),
      body("password")
        .trim()
        .isLength({ min: 8, max: 20 })
        .withMessage("Password must be between 8 and 20 characters"),
      body("firstName")
        .trim()
        .not()
        .isEmpty()
        .isLength({ min: 2, max: 20 })
        .withMessage("First name is required"),
      body("lastName")
        .trim()
        .not()
        .isEmpty()
        .isLength({ min: 2, max: 20 })
        .withMessage("Last name is required"),
      body("birthDate").isDate().withMessage("Birth date must be valid"),
      body("university")
        .trim()
        .not()
        .isEmpty()
        .withMessage("University is required"),
      body("department")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Department is required"),
    ],
    authRequestLogger,
    (req: Request, res: Response, next: NextFunction) => {
      controller.register(req, res, next);
    }
  );

  app.post(
    "/auth/login",
    [
      body("email").isEmail().withMessage("Email must be valid"),
      body("password")
        .trim()
        .isLength({ min: 8, max: 20 })
        .withMessage("Password must be between 8 and 20 characters"),
    ],
    authRequestLogger,
    (req: Request, res: Response, next: NextFunction) => {
      controller.login(req, res, next);
    }
  );

  // app.post(
  //   "/auth/verify-email",
  //   [
  //     body("email").isEmail().withMessage("Email must be valid"),
  //     // body("verificationCode")
  //     // .trim()
  //     // .isLength({ min: 8, max: 8 })
  //     // .withMessage("Verification code must be 6 characters"),
  //   ],
  //   authRequestLogger,
  //   (req: Request, res: Response, next: NextFunction) => {
  //   controller.verifyEmail(req, res, next);
  //   }
  // );
}

export default routes;
