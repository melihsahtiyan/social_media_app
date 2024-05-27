# API Endpoints

Owner: Melih Sahtiyan
Tags: Guides and Processes

This API Endpoints page provides detailed information on the various endpoints used in our application. It specifies the HTTP verb, endpoint, purpose, input, and output for each API call. The information here serves as a guide for developers to understand and use the API effectively.

## Auth

### Register                                                            ✅

**Verb: PUT**

**Endpoint**: `/auth/register`

**Purpose:** This endpoint is used to register a new user.

**Input:** The request body should contain the following parameters: 

```tsx
{
  "firstName": "string",
  "lastName": "string",
  "birthDate": "01-31-2024",
  "email": "string",
  "password": "string",
  "university": "string",
  "department": "string"
}
```

**Output:** Response message and status code

- 400: You must be 18 years old!
    
    ```
    	{
        "result": {
            "statusCode": 400,
            "message": "You must be 18 years old",
            "success": false
        }
    }
    ```
    
- 409: User already exists
    
    ```
    {
        "result": {
            "statusCode": 409,
            "message": "User already exists",
            "success": false
        }
    }
    ```
    
- 

### Login                                                                ✅

**Verb: POST**

**Endpoint: `/auth/login`**

**Purpose:** This endpoint is used to log in an existing user.

**Input:** The request body should contain the following parameters: 

```json
{
  "email": "string",
  "password": "string",
}
```

**Output:** The response will return an authentication token.

```json
{
    "message": "Token generated",
    "token": "JsonWebToken"
}
```

## User

### Get All Users

**Verb:** GET

**Endpoint:** `/user/getAllUsers`

**Purpose:** List all of the users for development purposes.

**Input:** NONE

**Output:** Message, success and data of the request.

- 200: Users fetched!
    
    ```json
    {
        "message": "Users fetched successfully",
        "data": [
            {
                "_id": "6627db0bcc05cb13ebf5d2c0",
                "firstName": "Ekin Cihan",
                "lastName": "Altan",
                "birthDate": "2000-05-23T00:00:00.000Z",
                "email": "cihanaltan@test.com",
                "password": "$2a$10$YKN7sSwF9IIZ9NATBIkmJerywR6Rd9w/SMXC34Q5N/Y/F2SKqOkl.",
                "university": "Nisantasi university",
                "department": "Aviation Management",
                "status": {
                    "studentVerification": false,
                    "emailVerification": true
                },
                "posts": [],
                "createdAt": "2024-04-23T15:59:38.215Z",
                "__v": 18,
                "friendRequests": [],
                "friends": [
                    "6627857fe445994d66cd2c44",
                    "65d0b6b0ccbddab883c12354"
                ]
            },
        ]
    }
    ```
    

### Get All User Details

**Verb:** GET

**Endpoint:** `/user/getAllDetails`

**Purpose:** List all of the users with detailed friends for development purposes.

**Input:** NONE

**Output:** Message, success and data of the request.

- 200: Users fetched!
    
    ```json
    {
        "message": "Users fetched successfully",
        "data": [
            {
                "_id": "6627db0bcc05cb13ebf5d2c0",
                "firstName": "Ekin Cihan",
                "lastName": "Altan",
                "email": "cihanaltan@test.com",
                "friends": [
                    {
                        "_id": "6627857fe445994d66cd2c44",
                        "firstName": "Burak",
                        "lastName": "Trman"
                    },
                    {
                        "_id": "65d0b6b0ccbddab883c12354",
                        "firstName": "Edvin",
                        "lastName": "Davulcu"
                    }
                ],
                "friendRequests": [],
                "posts": [],
                "createdAt": "2024-04-23T15:59:38.215Z"
            },
        ]
    }
    ```
    

### Update Profile  Authenticated  → Not done yet!

**Verb: PUT**

**Purpose:** This endpoint

### Change Profile Photo  Authenticated             ✅

**Verb:** PUT

**Endpoint: `/user/changeProfilePhoto`**

**Purpose:** This endpoint is used to log in an existing user.

**Input:** This request body should contain `form-data: profilePhoto` to send the image and also takes the `userId` from the given token.

**Output:** Message, success and status code.

- 200: Profile photo added!
    
    ```json
    {
        "statusCode": 200,
        "message": "Profile photo added!",
        "success": true
    }
    ```
    
- 400: You have not uploaded profile photo!
    
    ```
    {
        "statusCode": 400,
        "message": "You have not uploaded profile photo!",
        "success": false
    }
    ```
    
- 404: User not found!
    
    ```json
    {
        "statusCode": 404,
        "message": "User not found!",
        "success": false
    }
    ```
    

### Send Friend Request  Authenticated              ✅

**Verb: PUT**

**Endpoint: `/user/sendFriendRequest`**

**Purpose:** This endpoint is used to log in an existing user.

**Input:** This request body should contain `userId` to send the follow request and also takes the `userId` from the given token.

```json
{
    "userId": "660ab64a44696d035fec3a2b"
}
```

**Output:** This request returns a message for a certain events:

- 200: User unfriended!
    
    ```json
    {
        "message": "User unfollowed!"
    }
    ```
    
- 200: Friend request cancelled
    
    ```json
    {
        "message": "Follow request cancelled!"
    }
    ```
    
- 200: Friend request sent
    
    ```
    {
        "message": "Follow request sent!"
    }
    ```
    
- 500: Not authorized!
    
    ```json
    {
        "error": {
            "statusCode": 500,
            "message": "Not authenticated."
        }
    }
    ```
    

### Handle Friend Request  Authenticated           ✅

**Verb:** PUT

**Endpoint:** `/user/handleFriendRequest`

**Purpose:** This endpoint aims to handle the friend request for sender user sent request.

**Input:** This request body should contain `response: boolean` to accept or decline, `requestId: string` to handle user’s request and also take the `userId` from given token.

```json
{
    "userId": "6627857fe445994d66cd2c44",
    "response": true
}
```

**Output:** This request returns a message for a certain events:

- 200: Friend request accepted!
    
    ```json
    {
        "message": "Follow request accepted!"
    }
    ```
    
- 200: Friend request rejected!
    
    ```json
    {
        "message": "Follow request rejected!"
    }
    ```
    
- 404: Request not found!
    
    ```json
    {
        "result": {
            "statusCode": 404,
            "message": "No follow request found!",
            "success": false
        }
    }
    ```
    
- 400: Already a friend!
    
    ```json
    {
        "result": {
            "statusCode": 400,
            "message": "Follower is already following you!",
            "success": false
        }
    }
    ```
    
- 500: Not authorized!
    
    ```json
    {
        "error": {
            "statusCode": 500,
            "message": "Not authenticated."
        }
    }
    ```
    

### Unfriend User  Authenticated                               

**Verb: PUT**

**Endpoint: `/user/unfriend`**

**Purpose:** This endpoint is used to log in an existing user.

- **Input:** This request body should contain `userId` to send the follow request and also takes the `userId` from the given token.
    
    ```json
    {
        "userId": "660ab64a44696d035fec3a2b"
    }
    ```
    

**Output:** This request returns a message for a certain events:

- 200: User unfriended!
    
    ```json
    {
        "message": "User unfollowed!"
    }
    ```
    
- 404: User not found!
    
    ```json
    {
        "error": {
            "statusCode": 404,
            "message": "User not found!"
        }
    }
    ```
    
- 400: User is not your friend already!
- 500: Not authorized!
    
    ```json
    {
        "error": {
            "statusCode": 500,
            "message": "Not authenticated."
        }
    }
    ```
    

### View User Profile  Authenticated                    🟨

**Verb:** GET

**Endpoint:** `/user/viewUserDetails`

**Purpose: Get details about visited user and posts shared by him.**

- **Input: This request gets a `userId: string` to visit a user and takes another user from TOKEN.**
    
    ```
    {
        "userId": "65d0b6b0ccbddab883c12354"
    }
    ```
    

**Output:** Message, success and data of the request.

- 200: Users fetched!
    
    ```json
    {
        "message": "User fetched successfully",
        "data": {
            "_id": "65d0b6b0ccbddab883c12354",
            "firstName": "Edvin",
            "lastName": "Davulcu",
            "email": "edvindavulcu@test.com",
            "profilePhotoUrl": null,
            "university": "Maltepe university",
            "department": "Software Engineering",
            "friends": [],
            "friendCount": 4,
            "friendRequests": [],
            "posts": [
                {
                    "_id": "663f677e60d0bfcb93d46571",
                    "creator": "65d0b6b0ccbddab883c12354",
                    "poll": {
                        "question": "Sea of Thief oynar mıyız",
                        "options": [
                            {
                                "optionName": "evet",
                                "votes": 0
                            },
                            {
                                "optionName": "hayır",
                                "votes": 0
                            },
                            {
                                "optionName": "başka zamana",
                                "votes": 0
                            }
                        ],
                        "votes": [],
                        "totalVotes": 0,
                        "expiresAt": "2024-05-30T00:00:00.000Z"
                    },
                    "content": {
                        "mediaUrls": []
                    },
                    "createdAt": "2024-05-11T12:41:22.039Z",
                    "comments": [],
                    "likes": [
                        "660d59e1c74a2c7a0e1b3457"
                    ],
                    "commentCount": 0,
                    "likeCount": 1,
                    "isUpdated": false,
                    "isLiked": true
                }
            ],
            "createdAt": "2024-02-17T13:37:52.056Z"
        }
    }
    ```
    

### Get User By Token  Authenticated                  ✅

**Verb:** GET

**Endpoint:** `/user/getUserByToken`

**Purpose: Get details about visited user and posts shared by him.**

**Input: This request gets a user from TOKEN.**

**Output:** Message, success and data of the request.

- 200: Users fetched!
    
    ```json
    {
        "message": "User fetched successfully",
        "data": {
            "profilePhotoUrl": null,
            "_id": "660d59e1c74a2c7a0e1b3457",
            "firstName": "Tevfik Tayfun",
            "lastName": "Yılmaz",
            "birthDate": "2000-05-23T00:00:00.000Z",
            "email": "tiyatrocutayfun@test.com",
            "password": "$2a$10$V1Ymcnwkiltn6bvfrztJUuNf3KL5byuggNVNO.ct3GeGsrUjyhRya",
            "university": "Maltepe university",
            "department": "Software Engineering",
            "status": {
                "studentVerification": false,
                "emailVerification": true
            },
            "posts": [],
            "createdAt": "2024-04-03T13:23:55.065Z",
            "__v": 10,
            "friendRequests": [],
            "friends": [
                "65d0b6b0ccbddab883c12354"
            ]
        }
    }
    ```
    

### Search User By Name  Authenticated             ✅

**Verb:** GET

**Endpoint: `/user/searchByName/name={name}`**

**Purpose: Get details about visited user and posts shared by him.**

- **Input: This request gets a `name: string` from params and a token.**
    
    ```json
    {
        "name": "n"
    }
    ```
    

**Output:** Message, success and data of the request.

- 200: Users fetched!
    
    ```json
    {
        "message": "Users fetched successfully",
        "data": [
            {
                "_id": "660ab64a44696d035fec3a2b",
                "fullName": "Atakan Yiğit Çengeloğlu",
                "profilePhotoUrl": "profile photo url"
            }
        ]
    }
    ```
    

### Get All Friend Requests  Authenticated               

**Verb:** GET

**Endpoint:** `/user/getFriendRequests`

**Purpose:** Get all friend requests for the user from token.

**Input: This request gets a user from TOKEN.**

**Output:** Message, success and data of the request.

- 200: Users fetched!
    
    ```json
    {
        "message": "Friend requests fetched successfully",
        "data": [
            {
                "id": "65d0b6b0ccbddab883c12354",
                "firstName": "Edvin",
                "lastName": "Davulcu",
                "profilePhotoUrl": null
            }
        ]
    }
    ```
    

## Post

### Create Post  Authenticated                                     ✅

**Verb:** POST

**Endpoint:** `/post/create`

**Purpose:** This endpoint creates a post for the user by given token

**Input:** The request body should contain the following parameters:  `caption: string`  and at most 10 files for media to form-file parameter `”medias”`.

- form-data → “medias”
    
    ```json
    {
    	"caption": "string"
    }
    ```
    

**Output:** Message, success and caption of the post.

- 200: Post created!
    
    ```json
    {
        "message": "Post created successfully",
        "data": {
            "caption": "Very second Post! 😊😊"
        }
    }
    ```
    
- 422: Empty content!
    
    ```json
    {
        "result": {
            "statusCode": 422,
            "message": "Post must have content or media!",
            "success": false,
            "data": null
        }
    }
    ```
    
- 422: Too many files! (more than 10 files)
    
    ```json
    {
        "result": {
            "statusCode": 422,
            "message": "Too many files!",
            "success": false,
            "data": null
        }
    }
    ```
    
- 500: Not authorized!
    
    ```json
    {
        "error": {
            "statusCode": 500,
            "message": "Not authenticated."
        }
    }
    ```
    

### Get All Posts                                                            ✅

**Verb:** GET

**Endpoint: `/post/getAllPosts`**

**Purpose:** This endpoint aims to return all posts.

**Response:** Message, success and data of the request.

- 200: Posts listed!
    
    ```json
    {
        "message": "Posts fetched successfully",
        "data": [
            {
                "content": {
                    "caption": "Very second Post!",
                    "mediaUrls": [
                        "media/images/f9091494-3d02-41b7-827c-370d8015932e-164935396"
                    ]
                },
                "_id": "6627a4b4b9dfddadbc4a72a0",
                "creator": "6627857fe445994d66cd2c44",
                "likes": [],
                "createdAt": "2024-04-23T12:08:17.942Z",
                "comments": [],
                "type": "post",
                "isUpdated": false,
                "__v": 0
            }
        ]
    }
    ```
    

### Get Friend User’s Posts  Authenticated                  ✅

**Verb:** GET

**Endpoint:** `/get/getAllFriendsPosts`

**Purpose: T**his endpoint returns all posts from friends.

**Input:**  This request takes the `userId` from given token.

**Response:** Message, success and data of the request.

- 200: Posts fetched!
    
    ```json
    {
        "message": "Following posts fetched successfully",
        "data": [
            {
                "_id": "6627aa9c8e1011c8f80929a1",
                "creator": "6627857fe445994d66cd2c44",
                "content": {
                    "caption": "Post test",
                    "medias": []
                },
                "type": "post",
                "likes": [],
                "comments": [],
                "createdAt": "2024-04-23T12:33:26.721Z",
                "isUpdated": false
            }
        ]
    }
    ```
    
- 500: Not authorized!
    
    ```json
    {
        "error": {
            "statusCode": 500,
            "message": "Not authenticated."
        }
    }
    ```
    

### Get All From University Posts  Authenticated        ✅

**Verb:** GET

**Endpoint:** `/post/getAllUniversityPosts`

**Purpose:** This endpoint returns all posts from friends.

**Input:**  This request takes the `userId` from a given token.

**Response:** Message, success and data of the request.

- 200: Posts fetched!
    
    ```json
    {
        "message": "Following posts fetched successfully",
        "data": [
            {
                "_id": "664a13913fcf51c10f438359",
                "creator": {
                    "_id": "664a0f913280ef67fac5d377",
                    "firstName": "Edvin",
                    "lastName": "Davulcu",
                    "profilePhotoUrl": null
                },
                "content": {
                    "caption": "Edvin Davukcu kuş testi",
                    "files": [
                        "media/images/68b1b3af-92ad-4710-b02c-deb991a6c597-308650236.jpeg"
                    ]
                },
                "likes": [],
                "comments": [],
                "poll": null,
                "isUpdated": false,
                "createdAt": "2024-05-19T14:57:17.425Z",
                "isLiked": false
            }
        ]
    }
    ```
    
- 500: Not authorized!
    
    ```json
    {
        "error": {
            "statusCode": 500,
            "message": "Not authenticated."
        }
    }
    ```
    

### Get Post Details  Authenticated                              ✅

**Verb:** GET

**Endpoint:** `/post/getPostDetails/postId={postId}`

**Purpose:** This endpoint finds a post which has a creator in the same university or friend.

**Input:** The request has a param `postId={postId}` and the user from *jwt token.*

**Output:** Message, success and caption of the post.

- 200: Post fetched!
    
    ```json
    {
        "message": "Post fetched successfully",
        "data": {
            "content": {
                "caption": "3:11PM test",
                "mediaUrls": [
                    "media/images/8a36b9cf-806d-4767-9c97-d179186ef1f8-744702397.jpeg",
                ]
            },
            "_id": "663147b8d56dd767a918b983",
            "creator": {
                "_id": "660ab64a44696d035fec3a2b",
                "firstName": "Atakan Yiğit",
                "lastName": "Çengeloğlu",
                "university": "Maltepe university"
            },
            "likes": [],
            "createdAt": "2024-04-30T19:32:49.095Z",
            "comments": [],
            "type": "post",
            "isUpdated": false,
            "__v": 0
        }
    }
    ```
    

### Like Post  Authenticated                                         ✅

**Verb:** POST

**Endpoint:** `/post/likePost/postId={postId}`

**Purpose:** This endpoint finds a post and likes it by the user comes from the *jwt token.*

**Input:** The request has a param `postId={postId}` and the user from *jwt token.*

**Output:** Message, success and data of the post.

- 200: Post liked!
    
    ```json
    {
        "message": "Post fetched successfully",
        "data": {
            "content": {
                "caption": "3:11PM test",
                "mediaUrls": [
                    "media/images/8a36b9cf-806d-4767-9c97-d179186ef1f8-744702397.jpeg",
                ]
            },
            "_id": "663147b8d56dd767a918b983",
            "creator": {
                "_id": "660ab64a44696d035fec3a2b",
                "firstName": "Atakan Yiğit",
                "lastName": "Çengeloğlu",
                "university": "Maltepe university"
            },
            "likes": [],
            "createdAt": "2024-04-30T19:32:49.095Z",
            "comments": [],
            "type": "post",
            "isUpdated": false,
            "__v": 0
        }
    }
    ```
    
- 400: Already liked!
    
    ```json
    {
        "message": "You already liked this post!",
        "data": null
    }
    ```
    

### Unlike Post  Authenticated                                     ✅

**Verb:** POST

**Endpoint:** `/post/unlikePost/postId={postId}`

**Purpose:** This endpoint finds a post and unlikes it by the user comes from the *jwt token.*

**Input:** The request has a param `postId={postId}` and the user from *jwt token.*

**Output:** Message, success and data of the post.

- 200: Post unliked!
    
    ```json
    {
        "message": "Post fetched successfully",
        "data": {
            "content": {
                "caption": "3:11PM test",
                "mediaUrls": [
                    "media/images/8a36b9cf-806d-4767-9c97-d179186ef1f8-744702397.jpeg",
                ]
            },
            "_id": "663147b8d56dd767a918b983",
            "creator": {
                "_id": "660ab64a44696d035fec3a2b",
                "firstName": "Atakan Yiğit",
                "lastName": "Çengeloğlu",
                "university": "Maltepe university"
            },
            "likes": [],
            "createdAt": "2024-04-30T19:32:49.095Z",
            "comments": [],
            "type": "post",
            "isUpdated": false,
            "__v": 0
        }
    }
    ```
    

### Delete Post  Authenticated                                           

**Verb: DELETE**

**Endpoint:** `/post/delete/id={id}`

**Purpose:** This endpoint deletes a post for the user by given token

**Input:** The request has a param `id={postId}` and the user from *jwt token.*

**Output:** Message and success.

- 200: Post deleted!
    
    ```json
    {
        "message": "Post deleted successfully"
    }
    ```
    
- 404: Post not found!
    
    ```json
    {
        "result": {
            "statusCode": 422,
            "message": "Post must have content or media!",
            "success": false,
            "data": null
        }
    }
    ```
    
- 403: You are not authorized to delete this post!
    
    ```json
    {
        "result": {
            "statusCode": 403,
            "message": "You are not authorized to delete this post!"
        }
    }
    ```
    
- 500: Post deletion failed!
    
    ```json
    {
        "error": {
            "statusCode": 500,
            "message": "Post deletion failed!"
        }
    }
    ```
    

## Poll

### Create Poll  Authenticated                            ✅

**Verb:** POST

**Endpoint:** `/poll/create`

**Purpose:** This endpoint creates a post for the user by given token

- **Input:** The request body should contain the following parameters:  `caption: string`, Poll and at most 10 files for media to form-file parameter `”medias”`.
    
    ```tsx
    {
      content: caption: string;
      question: string;
      options: Array<{ optionName: string; }>;
      expiresAt: Date;
    }
    ```
    
- **Output:** Message, success and caption of the post.
    - 200: Poll created!
        
        ```json
        {
            "message": "Post created successfully",
            "data": {
                "caption": "Very second Post! 😊😊"
            }
        }
        ```
        
    - 422: Empty content!
        
        ```json
        {
            "result": {
                "statusCode": 422,
                "message": "Post must have content or media!",
                "success": false,
                "data": null
            }
        }
        ```
        
    - 422: Too many files! (more than 10 files)
        
        ```json
        {
            "result": {
                "statusCode": 422,
                "message": "Too many files!",
                "success": false,
                "data": null
            }
        }
        ```
        
    - 500: Not authorized!
        
        ```json
        {
            "error": {
                "statusCode": 500,
                "message": "Not authenticated."
            }
        }
        ```
        

### Vote Poll  Authenticated                               ✅

**Verb:** POST

**Endpoint:** `/poll/vote`

**Purpose:** This endpoint votes a poll.

- **Input:** The request body should contain the following parameters:  `pollId: string` and `option: string`.
    
    ```tsx
    {
        "pollId": "663cbe1b452674df34d21bfe",
        "option": "evet"
    }
    ```
    
- **Output:** Message, success and given  inputs.
    - 200: Poll voted successfully!
        
        ```json
        {
            "statusCode": 200,
            "message": "Voted successfully!",
            "success": true,
            "data": {
                "pollId": "663cbe1b452674df34d21bfe",
                "userId": "6627857fe445994d66cd2c44",
                "option": "hayır"
            }
        }
        ```
        
    - 200: Vote changed successfully!
        
        ```json
        {
            "statusCode": 200,
            "message": "Vote changed successfully!",
            "success": true,
            "data": {
                "pollId": "663cbe1b452674df34d21bfe",
                "userId": "6627857fe445994d66cd2c44",
                "option": "evet"
            }
        }
        ```
        
    - 400: You have already voted for this option! Vote deleted!
        
        ```
        {
            "statusCode": 400,
            "message": "You have already voted for this option! Vote deleted!",
            "success": false,
            "data": null
        }
        ```
        
    - 404: Option not found!
        
        ```
        {
            "statusCode": 404,
            "message": "Option not found!",
            "success": false,
            "data": null
        }
        ```
        
    - 500: Not authorized!
        
        ```json
        {
            "error": {
                "statusCode": 500,
                "message": "Not authenticated."
            }
        }
        ```
        

### Delete Vote  Authenticated

**Verb: DELETE**

**Endpoint:** `/poll/deleteVote`

**Purpose:** This endpoint deletes existed votes.

- **Input:** The request body should contain the following parameters:  `pollId: string` and `option: string`.
    
    ```tsx
    {
        "pollId": "663cbe1b452674df34d21bfe",
        "option": "evet"
    }
    ```
    
- **Output:** Message, success and given  inputs.
    - 200: Poll deleted successfully!
        
        ```json
        {
            "statusCode": 200,
            "message": "Vote deleted successfully!",
            "success": true,
            "data": null
        }
        ```
        
    - 400: You have not voted this poll!
        
        ```json
        {
            "result": {
                "statusCode": 422,
                "message": "Post must have content or media!",
                "success": false,
                "data": null
            }
        }
        ```
        
    
    ```
    {
        "statusCode": 400,
        "message": "You have not voted this poll!",
        "success": false,
        "data": null
    }
    ```
    
    - 500: Not authorized!
        
        ```json
        {
            "error": {
                "statusCode": 500,
                "message": "Not authenticated."
            }
        }
        ```
        

## Comment

### Create Comment  Authenticated

**Verb:** POST

**Endpoint:** `/comment/create`

**Purpose:** This endpoint creates a comment for the post given by request body.

- **Input:** The request body should contain the following parameters:  `postId: string, content: string`.
    
    ```tsx
    {
        "postId": "66536eda1f54d035dcb02472",
        "content": "little comment"
    }
    ```
    
- **Output:** Message, success and caption of the post.
    - 200: Comment created successfully!
        
        ```json
        {
            "result": {
                "success": true,
                "message": "Comment created successfully",
                "data": {
                    "content": "little comment",
                    "creator": "664a10073280ef67fac5d386",
                    "post": "66536eda1f54d035dcb02472"
                },
                "statusCode": 201
            }
        }
        ```
        
    - 422: Validation Error!
        
        ```json
        {
            "name": "Validation Error",
            "error": {
                "name": "Validation Error",
                "message": "Invalid value",
                "data": [
                    {
                        "type": "field",
                        "msg": "Invalid value",
                        "path": "content",
                        "location": "body"
                    },
                    {
                        "type": "field",
                        "msg": "Invalid value",
                        "path": "content",
                        "location": "body"
                    }
                ],
                "statusCode": 422
            },
            "message": "Invalid value"
        }
        ```
        
    - 500: Not authorized!
        
        ```json
        {
            "error": {
                "statusCode": 500,
                "message": "Not authenticated."
            }
        }
        ```
        

### Reply Comment  Authenticated

**Verb:** POST

**Endpoint:** `/comment/reply/{id}`

**Purpose:** This endpoint creates a reply for the comment given by params.

- **Input:** The request body should contain the following parameters:  `postId: string, content: string` and `commentId` from param.
    
    ```tsx
    {
        "postId": "66536eda1f54d035dcb02472",
        "content": "little comment"
    }
    ```
    
- **Output:** Message, success and caption of the post.
    - 200: Comment created successfully!
        
        ```json
        {
            "result": {
                "success": true,
                "message": "Comment created successfully",
                "data": {
                    "_id": "6653855d73b91a0d75ec9b29",
                    "creator": "664a10073280ef67fac5d386",
                    "post": "66536eda1f54d035dcb02472",
                    "content": "little comment",
                    "replies": [
                        "6653891f4c46caa3c3ab46ba"
                    ],
                    "createdAt": "2024-05-26T18:54:21.932Z"
                },
                "statusCode": 201
            }
        }
        ```
        
    - 404: Comment not found!
        
        ```json
        {
            "result": {
                "success": false,
                "message": "Comment not found",
                "data": null,
                "statusCode": 404
            }
        }
        ```
        
    - 422: Validation Error!
        
        ```json
        {
            "name": "Validation Error",
            "error": {
                "name": "Validation Error",
                "message": "Invalid value",
                "data": [
                    {
                        "type": "field",
                        "msg": "Invalid value",
                        "path": "content",
                        "location": "body"
                    },
                    {
                        "type": "field",
                        "msg": "Invalid value",
                        "path": "content",
                        "location": "body"
                    }
                ],
                "statusCode": 422
            },
            "message": "Invalid value"
        }
        ```
        
    - 500: Not authorized!
        
        ```json
        {
            "error": {
                "statusCode": 500,
                "message": "Not authenticated."
            }
        }
        ```
        

## **Club**

### Create Club  Authenticated

**Verb:** POST

**Endpoint:** `/club/create`

**Purpose:** This endpoint creates a club for the president user given by token.

- **Input:** For logo use form-file parameter `”profilePhoto”`, and The request body should contain the following parameters:
    
    ```tsx
    {
      name: "string";
      biography: "string";
      status: boolean;
      president: "string";
    }
    ```
    
- **Output:** Message, success and caption of the post.
    - 200: Club created!
        
        ```json
        {
            "message": "Club created",
            "data": {
                "name": "GDSC Maltepe",
                "logoUrl": null,
                "bannerUrl": null,
                "biography": "Google Developer Student Clubs @Maltepe University",
                "status": true,
                "president": "65d0b6b0ccbddab883c12354",
                "organizers": [
                    "65d0b6b0ccbddab883c12354"
                ],
                "members": [],
                "posts": [],
                "events": [],
                "_id": "6649d5b134d9c3ca31f881d4",
                "createdAt": "2024-05-19T10:34:25.557Z",
                "__v": 0
            }
        }
        ```
        
    - 404: President not found!
        
        ```json
        {
            "result": {
                "statusCode": 404,
                "message": "President not found!",
                "success": false,
                "data": null
            }
        }
        ```
        
    - 400: Club with this name already exists!
        
        ```json
        {
            "result": {
                "statusCode": 400,
                "message": "Club with this name already exists!",
                "success": false,
                "data": null
            }
        }
        ```
        

### Get Club By Id  Authenticated

**Verb: GET**

**Endpoint:** `/club/id={id}`

**Purpose:** This endpoint creates a club for the president user given by token.

- **Input:**
- **Output:** Message, success and caption of the post.
    - 200: Club created!
        
        ```json
        {
            "message": "Club created",
            "data": {
                "name": "GDSC Maltepe",
                "logoUrl": null,
                "bannerUrl": null,
                "biography": "Google Developer Student Clubs @Maltepe University",
                "status": true,
                "president": "65d0b6b0ccbddab883c12354",
                "organizers": [
                    "65d0b6b0ccbddab883c12354"
                ],
                "members": [],
                "posts": [],
                "events": [],
                "_id": "6649d5b134d9c3ca31f881d4",
                "createdAt": "2024-05-19T10:34:25.557Z",
                "__v": 0
            }
        }
        ```
        
    - 404: President not found!
        
        ```json
        {
            "result": {
                "statusCode": 404,
                "message": "President not found!",
                "success": false,
                "data": null
            }
        }
        ```
        
    - 400: Club with this name already exists!
        
        ```json
        {
            "result": {
                "statusCode": 400,
                "message": "Club with this name already exists!",
                "success": false,
                "data": null
            }
        }
        ```
        

### Update Club  Authenticated

**Verb: PUT**

**Endpoint:** `/club/id={id}`

**Purpose:** This endpoint creates a club for the president user given by token.

- **Input:** The request param should contain club id, and the body should contain these parameters:
    
    ```tsx
    {
      name: "string";
      biography: "string";
      status: boolean;
    }
    ```
    
- **Output:** Message, success and caption of the post.
    - 200: Club updated!
        
        ```json
        {
            "result": {
                "message": "Club updated",
                "data": {
                    "_id": "6649d5b134d9c3ca31f881d4",
                    "name": "GDSC Maltepe University",
                    "biography": "GDSC @Maltepe University",
                    "status": true,
                    "president": "660ab64a44696d035fec3a2b",
                    "organizers": [
                        "65d0b6b0ccbddab883c12354",
                        "660ab64a44696d035fec3a2b"
                    ],
                    "members": [],
                    "posts": [],
                    "events": [],
                    "createdAt": "2024-05-19T10:34:25.557Z",
                    "__v": 0,
                    "banner": "media/profilePhotos/d17287ef-fc21-48c5-b1cf-e12f42654174-611632990.png",
                    "logo": "media/profilePhotos/e8fca809-6f7a-4ef2-b3f9-49c4c69edfdb-470405640.png-logo.png"
                },
                "success": true,
                "statusCode": 200
            }
        }
        ```
        
    - 404: Organizer not found!
        
        ```json
        {
            "result": {
                "statusCode": 404,
                "message": "Organizer not found!",
                "success": false,
                "data": null
            }
        }
        ```
        
    - 404: Club not found!
        
        ```json
        {
            "result": {
                "statusCode": 404,
                "message": "Club not found!",
                "success": false,
                "data": null
            }
        }
        ```
        
    - 401: You are not authorized to update this club!
        
        ```json
        {
            "result": {
                "statusCode": 401,
                "message": "You are not authorized to update this club!",
                "success": false,
                "data": null
            }
        }
        ```
        
    - 400: Club with this name already exists!
        
        ```json
        {
            "result": {
                "statusCode": 400,
                "message": "Club with this name already exists!",
                "success": false,
                "data": null
            }
        }
        ```
        

### Update Club Logo  Authenticated

**Verb: PUT**

**Endpoint:** `/club/id={id}/logo`

**Purpose:** This endpoint updates logo of the club by the organizer user given by token.

**Input:** For logo use form-file parameter `”profilePhoto”`, and the user token.

- **Output:** Message, success and caption of the post.
    - 200: Club logo updated!
        
        ```json
        {
            "result": {
                "message": "Club logo updated",
                "data": {
                    "_id": "6649d5b134d9c3ca31f881d4",
                    "name": "GDSC Mau",
                    "biography": "Google Developer Student Clubs @Maltepe University",
                    "status": true,
                    "president": "65d0b6b0ccbddab883c12354",
                    "organizers": [
                        "65d0b6b0ccbddab883c12354"
                    ],
                    "members": [],
                    "posts": [],
                    "events": [],
                    "createdAt": "2024-05-19T10:34:25.557Z",
                    "__v": 0,
                    "banner": "media/profilePhotos/d17287ef-fc21-48c5-b1cf-e12f42654174-611632990.png",
                    "logo": "media/profilePhotos/e8fca809-6f7a-4ef2-b3f9-49c4c69edfdb-470405640.png-logo.png"
                },
                "success": true,
                "statusCode": 200
            }
        }
        ```
        
    - 404: Organizer not found!
        
        ```json
        {
            "result": {
                "statusCode": 404,
                "message": "Organizer not found!",
                "success": false,
                "data": null
            }
        }
        ```
        
    - 404: Club not found!
        
        ```json
        {
            "result": {
                "statusCode": 404,
                "message": "Club not found!",
                "success": false,
                "data": null
            }
        }
        ```
        
    - 401: You are not authorized to update this club!
        
        ```json
        {
            "result": {
                "statusCode": 401,
                "message": "You are not authorized to update this club!",
                "success": false,
                "data": null
            }
        }
        ```
        
    - 400: Logo is required!
        
        ```json
        {
            "result": {
                "statusCode": 400,
                "message": "Logo is required!",
                "success": false,
                "data": null
            }
        }
        ```
        

### Update Club Banner  Authenticated

**Verb: PUT**

**Endpoint:** `/club/id={id}/banner`

**Purpose:** This endpoint updates banner of the club by the organizer user given by token.

**Input:** For banner use form-file parameter `”profilePhoto”`, and the user token.

- **Output:** Message, success and caption of the post.
    - 200: Club created!
        
        ```json
        {
            "result": {
                "message": "Club banner updated!",
                "data": {
                    "_id": "6649d5b134d9c3ca31f881d4",
                    "name": "GDSC Mau",
                    "biography": "Google Developer Student Clubs @Maltepe University",
                    "status": true,
                    "president": "65d0b6b0ccbddab883c12354",
                    "organizers": [
                        "65d0b6b0ccbddab883c12354"
                    ],
                    "members": [],
                    "posts": [],
                    "events": [],
                    "createdAt": "2024-05-19T10:34:25.557Z",
                    "__v": 0,
                    "banner": "media/profilePhotos/d17287ef-fc21-48c5-b1cf-e12f42654174-611632990",
                    "logo": "media/profilePhotos/e8fca809-6f7a-4ef2-b3f9-49c4c69edfdb-470405640"
                },
                "success": true,
                "statusCode": 200
            }
        }
        ```
        
    - 404: Organizer not found!
        
        ```json
        {
            "result": {
                "statusCode": 404,
                "message": "Organizer not found!",
                "success": false,
                "data": null
            }
        }
        ```
        
    - 404: Club not found!
        
        ```json
        {
            "result": {
                "statusCode": 404,
                "message": "Club not found!",
                "success": false,
                "data": null
            }
        }
        ```
        
    - 401: You are not authorized to update this club!
        
        ```json
        {
            "result": {
                "statusCode": 401,
                "message": "You are not authorized to update this club!",
                "success": false,
                "data": null
            }
        }
        ```
        
    - 400: Banner is required!
        
        ```json
        {
            "result": {
                "statusCode": 400,
                "message": "Banner is required!",
                "success": false,
                "data": null
            }
        }
        ```
        

### Update Club President  Authenticated

**Verb: PUT**

**Endpoint:** `/club/id={id}/change-president`

**Purpose:** This endpoint updates banner of the club by the organizer user given by token.

**Input:** To change president, the body should contain `presidentId:"string"`, and current president id from the user token.

- **Output:** Message, success and caption of the post.
    - 200: Club created!
        
        ```json
        {
            "result": {
                "message": "Club banner updated!",
                "data": {
                    "_id": "6649d5b134d9c3ca31f881d4",
                    "name": "GDSC Mau",
                    "biography": "Google Developer Student Clubs @Maltepe University",
                    "status": true,
                    "president": "65d0b6b0ccbddab883c12354",
                    "organizers": [
                        "65d0b6b0ccbddab883c12354"
                    ],
                    "members": [],
                    "posts": [],
                    "events": [],
                    "createdAt": "2024-05-19T10:34:25.557Z",
                    "__v": 0,
                    "banner": "media/profilePhotos/d17287ef-fc21-48c5-b1cf-e12f42654174-611632990",
                    "logo": "media/profilePhotos/e8fca809-6f7a-4ef2-b3f9-49c4c69edfdb-470405640"
                },
                "success": true,
                "statusCode": 200
            }
        }
        ```
        
    - 404: President not found!
        
        ```json
        {
            "result": {
                "statusCode": 404,
                "message": "President not found!",
                "success": false,
                "data": null
            }
        }
        ```
        
    - 404: New president not found!
        
        ```json
        {
            "result": {
                "statusCode": 404,
                "message": "New president not found!",
                "success": false,
                "data": null
            }
        }
        ```
        
    - 404: Club not found!
        
        ```json
        {
            "result": {
                "statusCode": 404,
                "message": "Club not found!",
                "success": false,
                "data": null
            }
        }
        ```
        
    - 401: You are not authorized to update this club!
        
        ```json
        {
            "result": {
                "statusCode": 401,
                "message": "You are not authorized to update this club!",
                "success": false,
                "data": null
            }
        }
        ```
        

### Delete Club  Authenticated

**Verb: DELETE**

**Endpoint:** `/club/id={id}`

**Purpose:** This endpoint deletes a club for the president user given by token.

**Input:** The request param should contain club id.

- **Output:** Message, success and caption of the post.
    - 200: Club deleted!
        
        ```json
        {
            "result": {
                "message": "Club deleted",
                "success": true,
                "statusCode": 200
            }
        }
        ```
        
    - 404: President not found!
        
        ```json
        {
            "result": {
                "statusCode": 404,
                "message": "President not found!",
                "success": false,
                "data": null
            }
        }
        ```
        
    - 404: Club not found!
        
        ```json
        {
            "result": {
                "statusCode": 404,
                "message": "Club not found!",
                "success": false,
                "data": null
            }
        }
        ```
        
    - 401: You are not authorized to update this club!
        
        ```json
        {
            "result": {
                "statusCode": 401,
                "message": "You are not authorized to update this club!",
                "success": false,
                "data": null
            }
        }
        ```
        

---