import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { CustomError } from "./types/error/CustomError";
import bodyParser from "body-parser";
import path from "path";
import { handleError } from "./middleware/errorHandlingMiddleware";
import fs from "fs";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import clubRoutes from "./routes/clubRoutes";
import postRoutes from "./routes/postRoutes";
import pollRoutes from "./routes/pollRoutes";
import commentRoutes from "./routes/commentRoutes";
import clubEventRoutes from "./routes/clubEventRoutes";
import fileRoute from "./routes/fileRoute";

fs.mkdirSync(path.join(__dirname, "../media/images"), { recursive: true });
fs.mkdirSync(path.join(__dirname, "../media/videos"), { recursive: true });
fs.mkdirSync(path.join(__dirname, "../media/profilePhotos"), {
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

userRoutes(app);
commentRoutes(app);
clubRoutes(app);
clubEventRoutes(app);
postRoutes(app);
pollRoutes(app);
authRoutes(app);
fileRoute(app);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen({ port: 8080 }, () => {
      console.log("Server running, MongoDB connected");
      app.use(handleError);
    });
  })
  .catch((err) => {
    const error: CustomError = new Error(err.message + " | MongoDB connection");
    error.statusCode = 500;
    throw error;
  });
