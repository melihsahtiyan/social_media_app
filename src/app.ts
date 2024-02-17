import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { CustomError } from "./types/error/CustomError";
import bodyParser from "body-parser";
import path from "path";
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";
import userRoutes from "./routes/userRoutes";
import { handleError } from "./middleware/errorHandlingMiddleware";
import logger from "./util/loggingHandler";
import fs from "fs";

fs.mkdirSync(path.join(__dirname, "../media/images"), { recursive: true });
fs.mkdirSync(path.join(__dirname, "../media/videos"), { recursive: true });
fs.mkdirSync(path.join(__dirname, "../media/profilePictures"), { 
  recursive: true,
});

dotenv.config();

const app: Express = express();

app.use(bodyParser.json());

app.use("/media", express.static(path.join(__dirname, "/media")));

app.use((req: Request, res: Response, next: NextFunction) => {
  // Allow access to any client
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Allow these headers
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept, Origin"
  );
  // Allow these methods
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  next();
});

app.use(
  "/auth",
  (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Path: ${req.path}
  Method: ${req.method}
  IP: ${req.ip}
  Request received at ${new Date().toISOString()}
  ---------------------------------------------------------`);
    next();
  },
  authRoutes
);
app.use("/post", postRoutes);
app.use("/user", userRoutes);

app.use(
  (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    handleError(error, req, res, next);
  }
);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen({ port: 8080 });
    console.log("Server running, MongoDB connected");
  })
  .catch((err) => {
    const error: CustomError = new Error(err.message + " | MongoDB connection");
    error.statusCode = 500;
    console.log(error);
  });
