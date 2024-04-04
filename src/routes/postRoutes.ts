import express from "express";
import { sourceUpload } from "../util/fileUtil";
import isAuth from "../middleware/is-auth";
import { logRequest } from "../util/loggingHandler";
import { PostService } from "../controllers/postService";
import { UserRepository } from "../repositories/user-repository";
import { PostRepository } from "../repositories/post-repository";

const router = express.Router();
const service = new PostService(new PostRepository(), new UserRepository());

router.post(
  "/create",
  isAuth,
  sourceUpload,
  logRequest,
  service.createPost
);

router.get("/getAllPosts", logRequest, service.getPosts);

router.get(
  "/getFollowingUser",
  isAuth,
  logRequest,
  service.getFollowingPosts
);

export default router;
