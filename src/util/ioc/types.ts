const TYPES = {
  IPostRepository: Symbol("IPostRepository"),
  IPostService: Symbol("IPostService"),
  PostController: Symbol("PostController"),

  IUserRepository: Symbol("IUserRepository"),
  IUserService: Symbol("IUserService"),
  UserController: Symbol("UserController"),

  IAuthService: Symbol("IAuthService"),
  AuthController: Symbol("AuthController"),

  IFriendshipRepository: Symbol("IFriendshipRepository"),
  IFriendshipService: Symbol("IFriendshipService"),
  FriendshipController: Symbol("FriendshipController"),

  IClubRepository: Symbol("IClubRepository"),
  IClubService: Symbol("IClubService"),
  ClubController: Symbol("ClubController"),

  ICommentRepository: Symbol("ICommentRepository"),
  ICommentService: Symbol("ICommentService"),
  CommentController: Symbol("CommentController"),

  IChatRepository: Symbol("IChatRepository"),
  IChatService: Symbol("IChatService"),
  ChatController: Symbol("ChatController"),

  IPollRepository: Symbol("IPollRepository"),
  IPollService: Symbol("IPollService"),
  PollController: Symbol("PollController"),

  IClubEventRepository: Symbol("IClubEventRepository"),
  IClubEventService: Symbol("IClubEventService"),
  ClubEventController: Symbol("ClubEventController"),

  IMessageChunkRepository: Symbol("IMessageChunkRepository"),
  IMessageChunkService: Symbol("IMessageChunkService"),
  MessageChunkController: Symbol("MessageChunkController"),

  IMessageRepository: Symbol("IMessageRepository"),
  IMessageService: Symbol("IMessageService"),
  MessageController: Symbol("MessageController"),

  ICloudinaryService: Symbol("ICloudinaryService"),
};

export default TYPES;
