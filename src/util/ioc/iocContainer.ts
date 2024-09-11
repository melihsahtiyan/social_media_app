import 'reflect-metadata';
import { Container } from 'inversify';
import { PostRepository } from '../../repositories/post-repository';
import { PostService } from '../../services/postService';
import { UserRepository } from '../../repositories/user-repository';
import { UserService } from '../../services/userService';
import { AuthService } from '../../services/authService';
import { AuthController } from '../../controllers/authController';
import { UserController } from '../../controllers/userController';
import { PostController } from '../../controllers/postController';
import { PollRepository } from '../../repositories/poll-repository';
import { PollService } from '../../services/pollService';
import { PollController } from '../../controllers/pollController';
import { ClubRepository } from '../../repositories/club-repository';
import { ClubService } from '../../services/clubService';
import { ClubController } from '../../controllers/clubController';
import { CommentRepository } from '../../repositories/comment-repository';
import { CommentService } from '../../services/commentService';
import { CommentController } from '../../controllers/commentController';
import { ClubEventRepository } from '../../repositories/club-event-repository';
import { ClubEventService } from '../../services/clubEventService';
import { ClubEventController } from '../../controllers/clubEventController';
import { CloudinaryService } from '../../services/cloudinaryService';
import { FriendshipService } from '../../services/friendshipService';
import { FriendshipController } from '../../controllers/friendshipController';

const container: Container = new Container();

container.bind<PostRepository>(PostRepository).to(PostRepository).inSingletonScope();
container.bind<PostService>(PostService).to(PostService).inSingletonScope();
container.bind<PostController>(PostController).to(PostController).inSingletonScope();

container.bind<PollRepository>(PollRepository).to(PollRepository).inSingletonScope();
container.bind<PollService>(PollService).to(PollService).inSingletonScope();
container.bind<PollController>(PollController).to(PollController).inSingletonScope();

container.bind<UserRepository>(UserRepository).to(UserRepository).inSingletonScope();
container.bind<UserService>(UserService).to(UserService).inSingletonScope();
container.bind<UserController>(UserController).to(UserController).inSingletonScope();

container.bind<FriendshipService>(FriendshipService).to(FriendshipService).inSingletonScope();
container.bind<FriendshipController>(FriendshipController).to(FriendshipController).inSingletonScope();

container.bind<ClubRepository>(ClubRepository).to(ClubRepository).inSingletonScope();
container.bind<ClubService>(ClubService).to(ClubService).inSingletonScope();
container.bind<ClubController>(ClubController).to(ClubController).inSingletonScope();

container.bind<CommentRepository>(CommentRepository).to(CommentRepository).inSingletonScope();
container.bind<CommentService>(CommentService).to(CommentService).inSingletonScope();
container.bind<CommentController>(CommentController).to(CommentController).inSingletonScope();

container.bind<ClubEventRepository>(ClubEventRepository).to(ClubEventRepository).inSingletonScope();
container.bind<ClubEventService>(ClubEventService).to(ClubEventService).inSingletonScope();
container.bind<ClubEventController>(ClubEventController).to(ClubEventController).inSingletonScope();

container.bind<AuthService>(AuthService).to(AuthService).inSingletonScope();
container.bind<AuthController>(AuthController).to(AuthController).inSingletonScope();

container.bind<CloudinaryService>(CloudinaryService).to(CloudinaryService).inSingletonScope();

export default container;
