import express from "express";
import { sourceUpload } from "../util/fileUtil";
import isAuth from "../middleware/is-auth";
import { logRequest } from "../util/loggingHandler";
import { PostService } from "../services/postService";
import { UserRepository } from "../repositories/user-repository";
import { PostRepository } from "../repositories/post-repository";
import { PostsContoller } from "../controllers/postsController";

const router = express.Router();
const postService: PostService = new PostService(
  new PostRepository(),
  new UserRepository()
);
const controller = new PostsContoller(postService);

router.post("/create", isAuth, sourceUpload, logRequest, controller.createPost);

router.get("/getAllPosts", logRequest, controller.getPosts);

router.get(
  "/getFollowingUser",
  isAuth,
  logRequest,
  controller.getFollowingPosts
);

export default router;
