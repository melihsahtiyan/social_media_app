import express from "express";
import { body } from "express-validator";
import { fileUpload } from "../util/fileUtil";
import isAuth from "../middleware/is-auth";
import * as userController from "../controllers/userController";

const router = express.Router();

router.put("/updateProfile", fileUpload, isAuth, userController.updateProfile);

router.put(
  "/follow",
  [body("userId").isAlphanumeric().withMessage("User ID cannot be empty!")],
  isAuth,
  userController.followUser
);

export default router;
