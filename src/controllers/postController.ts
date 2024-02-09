import { NextFunction, Response } from "express";
import Request from "../types/Request";
import { PostForCreateDto } from "../types/dtos/post/postForCreateDto";
import { isValid } from "../util/validationHandler";
import { CustomError } from "../types/error/CustomError";
import Post, { IPost } from "../models/Post";

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  isValid(req, next);
  const postForCreateDto: PostForCreateDto = req.body;

  try {
    if (req.files.values.length > 10) {
      const error: CustomError = new Error("Too many files!");
      error.statusCode = 422;
      throw error;
    }

    if (req.files.length > 0) {
      const sourceUrls: string[] = req.files.map((file) => file.path);
      postForCreateDto.mediaUrls = sourceUrls;
    }

    const post: IPost = new Post({
      ...postForCreateDto,
      creator: req.userId,
    });

    await post.save();

    res.status(201).json({ message: "Post created!", post: post });
  } catch (err) {
    err.message = err.message || "Post creation failed";
    next(err);
  }
};
