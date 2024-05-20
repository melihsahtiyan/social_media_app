import "reflect-metadata";
import { Container } from "inversify";
import TYPES from "./types";
import { PostRepository } from "../../repositories/post-repository";
import { PostService } from "../../services/postService";
import { UserRepository } from "../../repositories/user-repository";
import { UserService } from "../../services/userService";
import { AuthService } from "../../services/authService";
import { AuthController } from "../../controllers/authController";
import { UserController } from "../../controllers/userController";
import { PostController } from "../../controllers/postController";
import { PollRepository } from "../../repositories/poll-repository";
import { PollService } from "../../services/pollService";
import { PollController } from "../../controllers/pollController";
import { ClubRepository } from "../../repositories/club-repository";
import { ClubService } from "../../services/clubService";
import { ClubController } from "../../controllers/clubController";
import { EventService } from "../../services/eventService";
import { EventRepository } from "../../repositories/event-repository";
import { EventController } from "../../controllers/eventController";

const container: Container = new Container();

container
  .bind<PostRepository>(PostRepository)
  .to(PostRepository)
  .inSingletonScope();
container.bind<PostService>(PostService).to(PostService).inSingletonScope();
container
  .bind<PostController>(PostController)
  .to(PostController)
  .inSingletonScope();

container
  .bind<PollRepository>(PollRepository)
  .to(PollRepository)
  .inSingletonScope();
container.bind<PollService>(PollService).to(PollService).inSingletonScope();
container
  .bind<PollController>(PollController)
  .to(PollController)
  .inSingletonScope();

container
  .bind<UserRepository>(UserRepository)
  .to(UserRepository)
  .inSingletonScope();
container.bind<UserService>(UserService).to(UserService).inSingletonScope();
container
  .bind<UserController>(UserController)
  .to(UserController)
  .inSingletonScope();

container
  .bind<ClubRepository>(ClubRepository)
  .to(ClubRepository)
  .inSingletonScope();
container.bind<ClubService>(ClubService).to(ClubService).inSingletonScope();
container
  .bind<ClubController>(ClubController)
  .to(ClubController)
  .inSingletonScope();

container
  .bind<EventRepository>(EventRepository)
  .to(EventRepository)
  .inSingletonScope();
container.bind<EventService>(EventService).to(EventService).inSingletonScope();
container
  .bind<EventController>(EventController)
  .to(EventController)
  .inSingletonScope();

container.bind<AuthService>(AuthService).to(AuthService).inSingletonScope();
container
  .bind<AuthController>(AuthController)
  .to(AuthController)
  .inSingletonScope();

export default container;
