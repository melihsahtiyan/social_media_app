import { Container }                from "inversify";
import { PollController }           from "./controllers/poll.controller";
import { PostController }           from "./controllers/post.controller";
import { UserController }           from "./controllers/user.controller";
import { AuthController }           from "./controllers/auth.controller";
import { ChatController }           from "./controllers/chat.controller";
import { ClubController }           from "./controllers/club.controller";
import { MessageController }        from "./controllers/message.controller";
import { CommentController }        from "./controllers/comment.controller";
import ControllerIdentifiers        from "./constants/ControllerIdentifiers";
import { ClubEventController }      from "./controllers/club.event.controller";
import { FriendshipController }     from "./controllers/friendship.controller";
import { MessageChunkController }   from "./controllers/message.chunk.controller";
import serviceContainer from "../application/ApplicationServiceRegistration";

const controllerContainer: Container = serviceContainer;

controllerContainer.bind<PostController>(ControllerIdentifiers.PostController).to(PostController).inSingletonScope();
controllerContainer.bind<PollController>(ControllerIdentifiers.PollController).to(PollController).inSingletonScope();
controllerContainer.bind<UserController>(ControllerIdentifiers.UserController).to(UserController).inSingletonScope();
controllerContainer.bind<ChatController>(ControllerIdentifiers.ChatController).to(ChatController).inSingletonScope();
controllerContainer.bind<MessageChunkController>(ControllerIdentifiers.MessageChunkController).to(MessageChunkController).inSingletonScope();
controllerContainer.bind<MessageController>(ControllerIdentifiers.MessageController).to(MessageController).inSingletonScope();
controllerContainer.bind<FriendshipController>(ControllerIdentifiers.FriendshipController).to(FriendshipController).inSingletonScope();
controllerContainer.bind<ClubController>(ControllerIdentifiers.ClubController).to(ClubController).inSingletonScope();
controllerContainer.bind<CommentController>(ControllerIdentifiers.CommentController).to(CommentController).inSingletonScope();
controllerContainer.bind<ClubEventController>(ControllerIdentifiers.ClubEventController).to(ClubEventController).inSingletonScope();
controllerContainer.bind<AuthController>(ControllerIdentifiers.AuthController).to(AuthController).inSingletonScope();

export default controllerContainer;