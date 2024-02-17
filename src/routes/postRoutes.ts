import express from "express";
import { body } from "express-validator";
import * as postController from "../controllers/postController";
import { sourceUpload } from "../util/fileUtil";
import isAuth from "../middleware/is-auth";
import { logRequest } from "../util/loggingHandler";

const router = express.Router();

router.post(
  "/create",
  isAuth,
  sourceUpload,
  logRequest,
  postController.createPost
);

router.get("/getAllPosts", logRequest, postController.getPosts);

export default router;
