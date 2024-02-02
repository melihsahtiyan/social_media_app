import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { CustomError } from "./types/error/CustomError";
import bodyParser from "body-parser";
import { fileUpload } from "./util/fileUtil";
import path from "path";
import authRoutes from "./routes/authRoutes";
import { handleError } from "./middleware/errorHandlingMiddleware";

dotenv.config();

const app: Express = express();

// ottoman
//   .connect(process.env.COUCHBASE_URL)
//   .then(() => {
//     ottoman
//       .start()
//       .then(() => {
//         app.listen(8080, () => {
//           console.log("Server running, Couchbase connected");

//           const post = new Post({
//             creator: "test",
//             content: "test",
//             mediaUrls: ["test"],
//             likes: ["test"],
//             createdAt: new Date(),
//             comments: ["test"],
//             type: "Open",
//           });
//         });
//       })
//       .catch((err) => {
//         const error: CustomError = new Error(err.message);
//         error.statusCode = 500;
//         throw error;
//       });
//   })
//   .catch((err) => {
//     const error: CustomError = new Error(
//       err.message + " | Couchbase connection"
//     );
//     error.statusCode = 500;
//     throw error;
//   });

app.use(bodyParser.json());
app.use(fileUpload);
app.use("/media", express.static(path.join(__dirname, "/media")));

app.use((req, res, next) => {
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

app.use("/auth", authRoutes);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  handleError(error, req, res, next);
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen({ port: 8080 });
    console.log("Server running, MongoDB connected");
  })
  .catch((err) => {
    const error: CustomError = new Error(err.message + " | MongoDB connection");
    error.statusCode = 500;
    throw error;
  });
