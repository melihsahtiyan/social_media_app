import { Router } from "express";
import { body } from "express-validator";
import * as authController from "../controllers/authController";

const router: Router = Router();

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
  authController.register
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
  authController.login
);

export default router;
