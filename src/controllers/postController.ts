import { NextFunction, Response } from "express";
import Request from "../types/Request";
import { PostForCreateDto } from "../types/dtos/post/postForCreateDto";
import { isValid } from "../util/validationHandler";
import { CustomError } from "../types/error/CustomError";
import Post, { IPost } from "../models/Post";
import User, { IUser } from "../models/User";

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  isValid(req, next);
  const postForCreateDto: PostForCreateDto = req.body;

  console.log("====================================");
  console.log(req.body);
  console.log("====================================");

  try {
    if (req.files.length === 0 && postForCreateDto.caption.length === 0) {
      const error: CustomError = new Error("Post must have content or media!");
      error.statusCode = 422; // Unprocessable Entity
      throw error;
    }

    if (req.files.values.length > 10) {
      const error: CustomError = new Error("Too many files!");
      error.statusCode = 422; // Unprocessable Entity
      throw error;
    }

    const sourceUrls: string[] = req.files.map((file) => {
      const extension = file.mimetype.split("/")[1];
      const videoExtensions = ["mp4", "mov", "avi", "mkv", "webm", "m4v"];
      const imageExtensions = ["jpg", "jpeg", "png", "gif"];

      if (videoExtensions.includes(extension)) {
        return "media/videos/" + file.filename;
      } else if (imageExtensions.includes(extension)) {
        return "media/images/" + file.filename;
      } else {
        const error: CustomError = new Error("Invalid file type!");
        error.statusCode = 422;

        throw error;
      }
    });

    const post: IPost = new Post({
      type: postForCreateDto.type,
      content: {
        caption: postForCreateDto.caption,
        mediaUrls: sourceUrls || [],
      },
      creator: req.userId,
    });

    await post.save();

    res.status(201).json({ message: "Post created!", post: post });
  } catch (err) {
    err.message = err.message || "Post creation failed";
    next(err);
  }
};

export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const posts: IPost[] = await Post.find().sort({ createdAt: -1 });
    return res.status(200).json({ posts: posts });
  } catch (err) {
    err.message = err.message || "Fetching posts failed";
    next(err);
  }
};

export const getFollowingPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: IUser = await User.findById(req.userId);
    const posts: IPost[] = await Post.find({
      creator: { $in: user.following },
    }).sort({ createdAt: -1 });
    res.status(200).json({ posts: posts });
  } catch (err) {
    err.message = err.message || "Fetching posts failed";
    next(err);
  }
};
