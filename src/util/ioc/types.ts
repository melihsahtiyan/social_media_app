const TYPES = {
  PostRepository: Symbol("PostRepository"),
  PostService: Symbol("PostService"),
  PostController: Symbol("PostController"),

  UserRepository: Symbol("UserRepository"),
  UserService: Symbol("UserService"),
  UserController: Symbol("UserController"),

  AuthService: Symbol("AuthService"),
  AuthController: Symbol("AuthController"),

  FriendshipRepository: Symbol("FriendshipRepository"),
  FriendshipService: Symbol("FriendshipService"),
  FriendshipController: Symbol("FriendshipController"),

  ClubRepository: Symbol("ClubRepository"),
  ClubService: Symbol("ClubService"),
  ClubController: Symbol("ClubController"),

  CommentRepository: Symbol("CommentRepository"),
  CommentService: Symbol("CommentService"),
  CommentController: Symbol("CommentController"),

  ChatRepository: Symbol("ChatRepository"),
  ChatService: Symbol("ChatService"),
  ChatController: Symbol("ChatController"),

  PollRepository: Symbol("PollRepository"),
  PollService: Symbol("PollService"),
  PollController: Symbol("PollController"),

  ClubEventRepository: Symbol("ClubEventRepository"),
  ClubEventService: Symbol("ClubEventService"),
  ClubEventController: Symbol("ClubEventController"),

  MessageChunkRepository: Symbol("MessageChunkRepository"),
  MessageChunkService: Symbol("MessageChunkService"),

  MessageRepository: Symbol("MessageRepository"),

  CloudinaryService: Symbol("CloudinaryService"),
};

export default TYPES;
