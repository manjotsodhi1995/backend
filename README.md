# Node.js MongoDB REST API

A RESTful API built with **Node.js**, **Express**, and **MongoDB/Mongoose** providing user authentication (JWT), user management (CRUD), and a comments system.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT) with `express-jwt`
- **Password Hashing:** bcrypt.js

## Project Structure

```
├── server.js                  # App entry point – Express setup, routes, middleware
├── config.json                # DB connection string & JWT secret
├── package.json
├── _helpers/
│   ├── db.js                  # Mongoose connection & model exports
│   └── error-handler.js       # Global Express error-handling middleware
├── users/
│   ├── user.model.js          # Mongoose User schema
│   ├── user.service.js        # User business logic (auth, CRUD)
│   └── users.controller.js    # User route definitions
└── comments/
    ├── comment.model.js       # Mongoose Comment schema
    ├── comment.service.js     # Comment business logic (create/upsert, list)
    └── comment.controller.js  # Comment route definitions
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v10+)
- [MongoDB](https://www.mongodb.com/) instance (local or remote)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the database

Edit `config.json` to point to your MongoDB instance:

```json
{
  "connectionString": "mongodb://localhost:27017/node-mongo-registration-login-api",
  "secret": "your-jwt-secret"
}
```

Alternatively, set the `MONGODB_URI` environment variable to override the connection string.

### 3. Start the server

```bash
# Production
npm start

# Development (auto-reload with nodemon)
npm run start-dev
```

The server listens on:

- **Port 4000** in development
- **Port 80** (or `PORT` env var) in production (`NODE_ENV=production`)

## API Endpoints

### Users (`/users`)

| Method | Endpoint               | Description                        | Auth Required |
| ------ | ---------------------- | ---------------------------------- | ------------- |
| POST   | `/users/authenticate`  | Login – returns JWT token          | No            |
| POST   | `/users/register`      | Register a new user                | No            |
| GET    | `/users`               | List all users                     | No*           |
| GET    | `/users/current`       | Get the currently authenticated user | Yes          |
| GET    | `/users/:id`           | Get a user by ID                   | No*           |
| PUT    | `/users/:id`           | Update a user by ID                | No*           |
| DELETE | `/users/:id`           | Delete a user by ID                | No*           |

> \* These routes do not enforce authentication middleware at the controller level; consider adding JWT protection for production use.

#### Request / Response Examples

**Register**

```bash
curl -X POST http://localhost:4000/users/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","username":"johndoe","password":"secret123"}'
```

**Authenticate**

```bash
curl -X POST http://localhost:4000/users/authenticate \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","password":"secret123"}'
```

Response:

```json
{
  "_id": "...",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "createdDate": "2026-03-11T00:00:00.000Z",
  "token": "<jwt-token>"
}
```

### Comments (`/comment`)

| Method | Endpoint                  | Description                              | Auth Required |
| ------ | ------------------------- | ---------------------------------------- | ------------- |
| POST   | `/comment/postcomments`   | Create or update comments (batch upsert) | No            |
| GET    | `/comment/getcomments`    | Retrieve all comments                    | No            |

#### Request / Response Examples

**Post Comments** (accepts an array – upserts by `commentId`)

```bash
curl -X POST http://localhost:4000/comment/postcomments \
  -H "Content-Type: application/json" \
  -d '[{
    "commentId": 1,
    "currentDate": "2026-03-11T00:00:00.000Z",
    "commentTxt": "Hello world!",
    "creater": { "display_name": "John", "id": "u1" },
    "respondsto": 0,
    "replyComment": []
  }]'
```

**Get Comments**

```bash
curl http://localhost:4000/comment/getcomments
```

## Data Models

### User

| Field         | Type     | Constraints       |
| ------------- | -------- | ----------------- |
| `username`    | String   | unique, required  |
| `hash`        | String   | required (bcrypt) |
| `firstName`   | String   | required          |
| `lastName`    | String   | required          |
| `createdDate` | Date     | default: now      |

### Comment

| Field          | Type     | Description                          |
| -------------- | -------- | ------------------------------------ |
| `commentId`    | Number   | Logical identifier for upsert logic  |
| `currentDate`  | Date     | Timestamp of the comment             |
| `commentTxt`   | String   | Comment body text                    |
| `creater`      | Object   | `{ display_name: String, id: Any }`  |
| `respondsto`   | Number   | ID of the parent comment (threading) |
| `replyComment` | Array    | Nested reply data                    |

## Error Handling

A global error-handling middleware (`_helpers/error-handler.js`) catches and formats errors:

| Error Type              | HTTP Status | Response                          |
| ----------------------- | ----------- | --------------------------------- |
| Custom string errors    | 400         | `{ "message": "<error string>" }` |
| Mongoose ValidationError| 400         | `{ "message": "<validation msg>" }`|
| JWT UnauthorizedError   | 401         | `{ "message": "Invalid Token" }`  |
| All other errors        | 500         | `{ "message": "<error message>" }` |

## Environment Variables

| Variable       | Description                                      | Default                                                        |
| -------------- | ------------------------------------------------ | -------------------------------------------------------------- |
| `MONGODB_URI`  | MongoDB connection string (overrides config.json) | `mongodb://localhost:27017/node-mongo-registration-login-api`  |
| `PORT`         | Server port (production only)                     | `80`                                                           |
| `NODE_ENV`     | Set to `production` for production mode           | —                                                              |

## License

This project is provided as-is for educational purposes.
