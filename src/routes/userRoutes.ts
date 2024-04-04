import express from "express";
import { body } from "express-validator";
import { fileUpload } from "../util/fileUtil";
import isAuth from "../middleware/is-auth";
import { UserRepository } from "../repositories/user-repository";
import { UserService } from "../controllers/userService";

const router = express.Router();
const service = new UserService(new UserRepository());

router.put("/updateProfile", fileUpload, isAuth, service.updateProfile);

router.put(
  "/follow",
  [
    body("userId")
      .isAlphanumeric()
      .not()
      .isEmpty()
      .withMessage("User ID cannot be empty!"),
  ],
  isAuth,
  service.followUser
);

router.put(
  "/handleFollowRequest",
  [
    body("userId").isAlphanumeric().not().isEmpty(),
    body("followResponse").isBoolean().not().isEmpty(),
  ],
  isAuth,
  service.handleFollowRequest
);

export default router;
