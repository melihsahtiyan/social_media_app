import { Container }                from "inversify";
import { AuthService }              from "./services/auth.service";
import { ChatService }              from "./services/chat.service";
import { ClubEventService }         from "./services/clubEvent.service";
import { CommentService }           from "./services/comment.service";
import { ClubService }              from "./services/club.service";
import { FriendshipService }        from "./services/friendship.service";
import { MessageService }           from "./services/message.service";
import { MessageChunkService }      from "./services/messageChunk.service";
import { UserService  }             from "./services/user.service";
import { PollService  }             from "./services/poll.service";
import { PostService  }             from "./services/post.service";
import { CloudinaryService }        from "./services/cloudinary.service";
import { ServiceIdentifiers }       from "./constants/ServiceIdentifiers";
import container from "../persistence/PersistenceServiceRegistration";
import IAuthService from "./abstracts/IAuthService";
import IChatService from "./abstracts/IChatService";
import { IClubEventService } from "./abstracts/IClubEventService";
import { IClubService } from "./abstracts/IClubService";
import { ICommentService } from "./abstracts/ICommentService";
import { IFriendshipService } from "./abstracts/IFriendsipService";
import { IMessageService } from "./abstracts/IMessageService";
import { IMessageChunkService } from "./abstracts/IMessageChunkService";
import IUserService from "./abstracts/IUserService";
import { IPollService } from "./abstracts/IPollService";
import IPostService from "./abstracts/IPostService";


const serviceContainer: Container = container;

serviceContainer.bind<IAuthService>(ServiceIdentifiers.IAuthService).to(AuthService).inSingletonScope();
serviceContainer.bind<IChatService>(ServiceIdentifiers.IChatService).to(ChatService).inSingletonScope();

serviceContainer.bind<IClubEventService>(ServiceIdentifiers.IClubEventService).to(ClubEventService).inSingletonScope();
serviceContainer.bind<IClubService>(ServiceIdentifiers.IClubService).to(ClubService).inSingletonScope();
serviceContainer.bind<CloudinaryService>(ServiceIdentifiers.IFileUploadService).to(CloudinaryService).inSingletonScope();
serviceContainer.bind<ICommentService>(ServiceIdentifiers.ICommentService).to(CommentService).inSingletonScope();
serviceContainer.bind<IFriendshipService>(ServiceIdentifiers.IFriendshipService).to(FriendshipService).inSingletonScope();

serviceContainer.bind<IMessageService>(ServiceIdentifiers.IMessageService).to(MessageService).inSingletonScope();
serviceContainer.bind<IMessageChunkService>(ServiceIdentifiers.IMessageChunkService).to(MessageChunkService).inSingletonScope();
serviceContainer.bind<IUserService>(ServiceIdentifiers.IUserService).to(UserService).inSingletonScope();
serviceContainer.bind<IPollService>(ServiceIdentifiers.IPollService).to(PollService).inSingletonScope();
serviceContainer.bind<IPostService>(ServiceIdentifiers.IPostService).to(PostService).inSingletonScope();

export default serviceContainer;