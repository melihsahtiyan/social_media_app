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
    async (req: Request, res: Response, next: NextFunction) => {
      await controller.getPosts(req, res, next);
    }
  );

  app.get(
    "/post/getAllFriendsPosts",
    isAuth,
    logRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      await controller.getFriendsPosts(req, res, next);
    }
  );

  app.get(
    "/post/getPostDetails/postId=:postId",
    isAuth,
    logRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      await controller.getPostDetails(req, res, next);
    }
  );

  app.post(
    "/post/likePost/postId=:postId",
    isAuth,
    logRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      await controller.likePost(req, res, next);
    }
  );

  app.post(
    "/post/unlikePost/postId=:postId",
    isAuth,
    logRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      await controller.unlikePost(req, res, next);
    }
  );
}

export default routes;
