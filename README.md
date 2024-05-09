# Backend

Owner: melih sahtiyan
Tags: Codebase, Guides and Processes

# REST API

Hello and welcome to the social media app! This is a social media app that allows university students to post interesting events that are happening on campus.

This API is built using _[Node.js (TypeScript)](#node.js-and-typescript), [Express](#express.js),_ and _[MongoDB Atlas](#mongodb-atlas)_.

### Getting Started

- To use this template, follow these steps:

  1. Clone the repository: `git clone https://github.com/melihsahtiyan/social_media_app.git`
  2. Install dependencies: `npm install`
  3. Start the development server: `npm run dev`

  <br>

- Packages Used
  - [bcrypt](https://www.npmjs.com/package/bcrypt) is a library to help you hash passwords.
  - [body-parser](https://www.npmjs.com/package/body-parser) is a Node.js body parsing middleware.
  - [chai](https://www.chaijs.com/) is a BDD / TDD assertion library for node and the browser that can be delightfully paired with any **_JavaScript_** testing framework.
  - [dotenv](https://www.npmjs.com/package/dotenv) is a zero-dependency module that loads environment variables from a _.env_ file into _process.env_.
  - [Express](https://expressjs.com/) is a minimal and flexible **_Node.js_** web application framework that provides a robust set of features for web and mobile applications.
  - [express-validator](https://express-validator.github.io/docs/) is a set of **_Express.js_** middlewares that wraps validator.js validator and sanitizer functions.
  - [inversify](https://inversify.io/) is a powerful and lightweight inversion of control container for **_JavaScript_** & **_Node.js_** apps powered by **_TypeScript_**.
  - [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) is an implementation of JSON Web Tokens.
  - [nodemailer](https://nodemailer.com/about/) is a module for Node.js applications to allow easy as cake email sending.
  - [Nodemon](https://nodemon.io/) is a utility that will monitor for any changes in your source and automatically restart your server.
  - [multer](https://www.npmjs.com/package/multer) is a **_Node.js_** middleware for handling `multipart/form-data`, which is primarily used for uploading files.
  - [mongoose](https://mongoosejs.com/) is a **_[MongoDB](Backend%200a56389979d9499ca0a545284e27f9d2.md)_** object modeling tool designed to work in an asynchronous environment.
  - [mocha](https://mochajs.org/) is a feature-rich **_JavaScript_** test framework running on Node.js, making asynchronous testing simple and fun.
  - [sinon](https://sinonjs.org/) is a library to help you stub, mock and spy on function calls.
  - [reflect-metadata](https://www.npmjs.com/package/reflect-metadata) is a library to help you add metadata to your classes.

[API Endpoints](https://www.notion.so/API-Endpoints-1012e630aa394f4abf964377de9c62a4?pvs=21)

---

# Node.js and TypeScript

We use _Node.js_ environment and _TypeScript_ language. For a guide on getting started with _Node.js_ and _TypeScript_, check out these [Node.js docs](https://nodejs.org/docs/latest/api/) and [TypeScript docs](https://www.typescriptlang.org/docs/).

_Node.js_ is a runtime environment that enables the execution of _JavaScript_ code outside of a web browser. It serves as a platform for the development of scalable network applications like web servers, utilizing _JavaScript_.

On the other hand, _TypeScript_ is a statically typed superset of _JavaScript_ that introduces optional types to the language. It is transpiled to _JavaScript_ and can be executed in any _JavaScript_ environment, including _Node.js_.

## Advantages of Node.js

1. _Node.js_ is built on _Google Chrome's V8 JavaScript engine_, rendering it highly efficient for executing _JavaScript_ code.
2. It supports high scalability due to its event-driven, non-blocking I/O model.
3. _Node.js_ boasts a large and active community, leading to frequent updates and a vast array of reusable modules accessible through _npm_, the _Node Package Manager_.

## Advantages of TypeScript

1. _TypeScript_ facilitates early detection of errors through static type checking, thereby leading to safer and more reliable code.
2. It offers superior tooling and editor support, delivering features such as autocompletion and refactoring.
3. _TypeScript_ enhances code readability and comprehension through its type annotations, a feature particularly beneficial in large codebases.

---

# Express.js

_Express.js_ is a minimalist web framework for _Node.js_. It simplifies server creation, allowing easy setup of middlewares, routing rules, and additional functionalities. It streamlines backend development in Node.js.

1. _Express.js_ simplifies server creation in _Node.js_, making backend development more efficient.
2. It allows easy setup of middlewares, enabling developers to add additional functionalities to their applications.
3. _Express.js_ provides a robust set of routing rules, enabling the creation of dynamic web pages with ease.
4. It streamlines backend development in _Node.js_, saving developers time and effort.
5. The minimalist nature of _Express.js_ makes it lightweight and fast, potentially improving the performance of applications.

---

# MongoDB Atlas

We use _MongoDB Atlas_ for our database. For a guide on getting started with _MongoDB_, check out this [docs](https://www.mongodb.com/docs/atlas/getting-started/).

_MongoDB Atlas_ is a fully-managed cloud database service provided by _MongoDB_. It allows you to deploy, operate, and scale your databases on the cloud.

Advantages:

1. It offers high availability and consistency due to the use of a distributed database architecture.
2. It has built-in security features such as network isolation, encryption at rest and in transit, and robust access controls.

---

# Services

### Auth Service

[Register](./docs/readme/Register.md)

[Login](./docs/readme/Login.md)

[VerifyEmail](./docs/readme/VerifyEmail.md)

[Reset Password](./docs/readme/Reset%20Password.md)

### Post Service

[Create Post](./docs/readme/Create%20Post.md)

[Get all Posts](./docs/readme/Get%20all%20Posts.md)

### User Service

[Follow User](./docs/readme/Follow%20User.md)

[Handle Follow Request](./docs/readme/Handle%20Follow%20Request.md)

[Update Profile](./docs/readme/Update%20Profile.md)

---

# Models

## Post

### PostSchema

```tsx
creator: UserDoc;
content: { caption: string; mediaUrls: Array<string> };
likes: UserId[];
createdAt: Date;
comments: Array<CommentDoc>;
type: Enum => ["normal", "poll"];
isUpdated: Boolean;
```

### Poll → Post

```tsx
options: Array<String>;
votes: [
  {
    voter: UserId;
    option: String;
  }
];
totalVotes: Number;
expiresAt: Date;
createdAt: Date;
```

## Comment

```tsx
creator: UserId;
content: string;
createdAt: Date;
isUpdated: Boolean;
likes: UserId[];
replies: CommentId[];
```

## User

```tsx
firstName: string;
lastName: string;
birthDate: Date;
email: string;
password: string;
university: string;
department: string;
studentEmail: string;
status: {
  studentVerification: boolean;
  emailVerification: boolean;
 };
 profilePhotoUrl: string;
 followers: UserId[];
 followRequests: UserId[];
 following: UserId[];
 posts: PostId[];
 createdAt: Date;
```

---

# Features

## User

- Users can edit their profile.

### **Follow user**

- Users can send follow request to other users.
- Users can accept or decline follow request.
- Users can unfollow other users.
- Users can remove their followers.

## Post

- Users can share a post.
- Users can like a post.
- Users can start a poll.
- Users can vote in the poll.
- Users can comment on a post.
- Users can like a comment.

---

---
