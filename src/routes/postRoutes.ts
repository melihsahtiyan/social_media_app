import { NextFunction, Response, Express } from "express";
import Request from "../types/Request";
import { sourceUpload } from "../util/fileUtil";
import isAuth from "../middleware/is-auth";
import { logRequest } from "../util/loggingHandler";
import { PostController } from "../controllers/postController";
import container from "../util/ioc/iocContainer";

const controller: PostController =
  container.get<PostController>(PostController);

function routes(app: Express) {
  app.post(
    "/post/create",
    logRequest,
    sourceUpload,
    isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      await controller.createPost(req, res, next);
    }
  );
  app.get(
    "/post/getAllPosts",
    logRequest,
    (req: Request, res: Response, next: NextFunction) => {
      controller.getPosts(req, res, next);
    }
  );

  app.get(
    "/post/getAllFriendsPosts",
    isAuth,
    logRequest,
    (req: Request, res: Response, next: NextFunction) => {
      controller.getFriendsPosts(req, res, next);
    }
  );
}

export default routes;
