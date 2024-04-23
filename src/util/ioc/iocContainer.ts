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

const container: Container = new Container();

container
  .bind<PostRepository>(PostRepository)
  .to(PostRepository)
  .inSingletonScope();
container
  .bind<PostService>(PostService)
  .to(PostService)
  .inSingletonScope();
container
  .bind<PostController>(PostController)
  .to(PostController)
  .inSingletonScope();

container
  .bind<UserRepository>(UserRepository)
  .to(UserRepository)
  .inSingletonScope();
container
  .bind<UserService>(UserService)
  .to(UserService)
  .inSingletonScope();
container
  .bind<UserController>(UserController)
  .to(UserController)
  .inSingletonScope();

container
  .bind<AuthService>(AuthService)
  .to(AuthService)
  .inSingletonScope();
container
  .bind<AuthController>(AuthController)
  .to(AuthController)
  .inSingletonScope();

export default container;
