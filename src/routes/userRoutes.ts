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
    "/user/follow",
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
      controller.followUser(req, res, next);
    }
  );

  app.put(
    "/user/handleFollowRequest",
    [
      body("userId").isAlphanumeric().not().isEmpty(),
      body("followResponse").isBoolean().not().isEmpty(),
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
}
export default routes;
