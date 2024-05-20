import { Express } from "express";
import authRoutes from "./authRoutes";
import postRoutes from "./postRoutes";
import pollRoutes from "./pollRoutes";
import userRoutes from "./userRoutes";
import clubRoutes from "./clubRoutes";
import eventRoutes from "./eventRoutes";

function routes(app: Express) {
  authRoutes(app);
  userRoutes(app);
  eventRoutes(app);
  clubRoutes(app);
  postRoutes(app);
  pollRoutes(app);
  // commentRoutes(app);
}

export default routes;
