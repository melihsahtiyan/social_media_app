import { Router } from "express";
import { body } from "express-validator";
import { authService } from "../controllers/authService";
import { UserRepository } from "../repositories/user-repository";

const router: Router = Router();
const service = new authService(new UserRepository());

router.put(
  "/register",
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
  service.register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage("Password must be between 8 and 20 characters"),
  ],
  service.login
);

router.post(
  "/verify-email",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    // body("verificationCode")
    // .trim()
    // .isLength({ min: 8, max: 8 })
    // .withMessage("Verification code must be 6 characters"),
  ],
  service.verifyEmail
);

export default router;
