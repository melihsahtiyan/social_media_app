import express from "express";
import { body } from "express-validator";
import * as postController from "../controllers/postController";
import { sourceUpload } from "../util/fileUtil";
import isAuth from "../middleware/is-auth";

const router = express.Router();

router.post("/create", isAuth, sourceUpload, postController.createPost);

router.get("/getAllPosts", postController.getPosts);

export default router;
