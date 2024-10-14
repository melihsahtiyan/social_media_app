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
import { ChatRepository } from '../../repositories/chat-repository';
import { ChatService } from '../../services/chatService';
import { ChatController } from '../../controllers/chatController';
import { MessageChunkRepository } from '../../repositories/message-chunk-repository';
import { MessageChunkService } from '../../services/messageChunkService';
import { MessageRepository } from '../../repositories/message-repository';
import { MessageController } from '../../controllers/messageController';
import { MessageService } from '../../services/messageService';
import { IChatRepository } from '../../types/repositories/IChatRepository';
import IChatService from '../../types/services/IChatService';
import TYPES from './types';
import IAuthService from '../../types/services/IAuthService';
import { IClubEventService } from '../../types/services/IClubEventService';
import { IClubEventRepository } from '../../types/repositories/IClubEventRepository';
import { ICommentService } from '../../types/services/ICommentService';
import { ICommentRepository } from '../../types/repositories/ICommentRepository';
import { IClubService } from '../../types/services/IClubService';
import { IClubRepository } from '../../types/repositories/IClubRepository';
import { IFriendshipService } from '../../types/services/IFriendsipService';
import { IMessageService } from '../../types/services/IMessageService';
import { IMessageRepository } from '../../types/repositories/IMessageRepository';
import { IMessageChunkService } from '../../types/services/IMessageChunkService';
import { IMessageChunkRepository } from '../../types/repositories/IMessageChunkRepository';
import { MessageChunkController } from '../../controllers/messageChunkController';
import IUserService from '../../types/services/IUserService';
import IUserRepository from '../../types/repositories/IUserRepository';
import { IPollService } from '../../types/services/IPollService';
import { IPollRepository } from '../../types/repositories/IPollRepository';
import IPostService from '../../types/services/IPostService';
import IPostRepository from '../../types/repositories/IPostRepository';

const container: Container = new Container();

container.bind<IPostRepository>(TYPES.IPostRepository).to(PostRepository).inSingletonScope();
container.bind<IPostService>(TYPES.IPostService).to(PostService).inSingletonScope();
container.bind<PostController>(TYPES.PostController).to(PostController).inSingletonScope();

container.bind<IPollRepository>(TYPES.IPollRepository).to(PollRepository).inSingletonScope();
container.bind<IPollService>(TYPES.IPollService).to(PollService).inSingletonScope();
container.bind<PollController>(TYPES.PollController).to(PollController).inSingletonScope();

container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository).inSingletonScope();
container.bind<IUserService>(TYPES.IUserService).to(UserService).inSingletonScope();
container.bind<UserController>(TYPES.UserController).to(UserController).inSingletonScope();

container.bind<IChatRepository>(TYPES.IChatRepository).to(ChatRepository).inSingletonScope();
container.bind<IChatService>(TYPES.IChatService).to(ChatService).inSingletonScope();
container.bind<ChatController>(TYPES.ChatController).to(ChatController).inSingletonScope();

container.bind<IMessageChunkRepository>(TYPES.IMessageChunkRepository).to(MessageChunkRepository).inSingletonScope();
container.bind<IMessageChunkService>(TYPES.IMessageChunkService).to(MessageChunkService).inSingletonScope();
container.bind<MessageChunkController>(TYPES.MessageChunkController).to(MessageChunkController).inSingletonScope();

container.bind<IMessageRepository>(TYPES.IMessageRepository).to(MessageRepository).inSingletonScope();
container.bind<IMessageService>(TYPES.IMessageService).to(MessageService).inSingletonScope();
container.bind<MessageController>(TYPES.MessageController).to(MessageController).inSingletonScope();

container.bind<IFriendshipService>(TYPES.IFriendshipService).to(FriendshipService).inSingletonScope();
container.bind<FriendshipController>(TYPES.FriendshipController).to(FriendshipController).inSingletonScope();

container.bind<IClubRepository>(TYPES.IClubRepository).to(ClubRepository).inSingletonScope();
container.bind<IClubService>(TYPES.IClubService).to(ClubService).inSingletonScope();
container.bind<ClubController>(TYPES.ClubController).to(ClubController).inSingletonScope();

container.bind<ICommentRepository>(TYPES.ICommentRepository).to(CommentRepository).inSingletonScope();
container.bind<ICommentService>(TYPES.ICommentService).to(CommentService).inSingletonScope();
container.bind<CommentController>(TYPES.CommentController).to(CommentController).inSingletonScope();

container.bind<IClubEventRepository>(TYPES.IClubEventRepository).to(ClubEventRepository).inSingletonScope();
container.bind<IClubEventService>(TYPES.IClubEventService).to(ClubEventService).inSingletonScope();
container.bind<ClubEventController>(TYPES.ClubEventController).to(ClubEventController).inSingletonScope();

container.bind<IAuthService>(TYPES.IAuthService).to(AuthService).inSingletonScope();
container.bind<AuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();

container.bind<CloudinaryService>(TYPES.ICloudinaryService).to(CloudinaryService).inSingletonScope();

export default container;
