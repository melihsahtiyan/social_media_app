import { Express, NextFunction, Response } from "express";
import { body } from "express-validator";
import { fileUpload } from "../util/fileUtil";
import isAuth from "../middleware/is-auth";
import { UserController } from "../controllers/userController";
import container from "../util/ioc/iocContainer";
import Request from "../types/Request";
import { logRequest } from "../util/loggingHandler";

const controller: UserController =
  container.get<UserController>(UserController);

function routes(app: Express) {
  app.put(
    "/user/updateProfile",
    fileUpload,
    isAuth,
    (req: Request, res: Response, next: NextFunction) => {
      controller.updateProfile(req, res, next);
    }
  );

  app.put(
    "/user/sendFriendRequest",
    [
      body("userId")
        .isAlphanumeric()
        .not()
        .isEmpty()
        .withMessage("User ID cannot be empty!"),
    ],
    isAuth,
    logRequest,
    (req: Request, res: Response, next: NextFunction) => {
      controller.sendFriendRequest(req, res, next);
    }
  );

  app.put(
    "/user/handleFriendRequest",
    [
      body("userId").isAlphanumeric().not().isEmpty(),
      body("response").isBoolean().not().isEmpty(),
    ],
    isAuth,
    (req: Request, res: Response, next: NextFunction) => {
      controller.handleFollowRequest(req, res, next);
    }
  );

  app.get(
    "/user/getAllUsers",
    (req: Request, res: Response, next: NextFunction) => {
      controller.getAllUsers(req, res, next);
    }
  );

  app.get(
    "/user/getAllDetails",
    (req: Request, res: Response, next: NextFunction) => {
      controller.getAllDetails(req, res, next);
    }
  );
}
export default routes;
