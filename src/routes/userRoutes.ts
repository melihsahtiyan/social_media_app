import express from "express";
import { body } from "express-validator";
import { fileUpload } from "../util/fileUtil";
import isAuth from "../middleware/is-auth";
import { UserRepository } from "../repositories/user-repository";
import { UserService } from "../services/userService";
import { UsersContoller } from "../controllers/usersController";

const router = express.Router();
const userService = new UserService(new UserRepository());
const controller = new UsersContoller(userService);

router.put("/updateProfile", fileUpload, isAuth, controller.updateProfile);

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
  controller.followUser
);

router.put(
  "/handleFollowRequest",
  [
    body("userId").isAlphanumeric().not().isEmpty(),
    body("followResponse").isBoolean().not().isEmpty(),
  ],
  isAuth,
  controller.handleFollowRequest
);

router.get("/getAllUsers", controller.getAllUsers);

export default router;
