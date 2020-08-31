<<<<<<< HEAD
# REST API to manage bookmarks

# API Usage

## Authentication

### Signup

#### Request

```sh
POST /signup HTTP/1.1
Content-Type: application/json

{
    "email": "test@test.com",
    "password": "password"
}
```

#### Sample Response

```json
{
  "jwt": "<jwt>",
  "ownerEmail": "test@test.com"
}
```

### Signin

#### Request

```sh
POST /signin HTTP/1.1
Content-Type: application/json

{
    "email": "test@test.com",
    "password": "password"
}
```

#### Sample Response

```json
{
  "jwt": "<jwt>",
  "ownerEmail": "test@test.com"
}
```

### Refresh

```sh
POST /refresh HTTP/1.1
Content-Type: application/json

{
    "email": "test@test.com",
    "password": "password"
}
```

#### Sample Response

```json
{
  "jwt": "<jwt>",
  "ownerEmail": "test@test.com"
}
```

## Bookmarks

### Create

#### Request

```sh
POST /bookmarks HTTP/1.1
Authorization: <jwt>
Content-Type: application/json

{
    "name": "Google",
    "url": "https://google.com"
}
```

#### Sample Response

```json
{
  "id": 1,
  "ownerEmail": "test@test.com",
  "name": "Google",
  "url": "https://google.com",
  "updatedAt": "2020-08-31T05:11:20.381Z",
  "createdAt": "2020-08-31T05:11:20.381Z",
  "parent": null
}
```

### List

#### Request

```sh
GET /bookmarks HTTP/1.1
Authorization: <jwt>
Content-Type: application/json
```

#### Sample Response

```json
[
  {
    "id": 1,
    "name": "Google",
    "url": "https://google.com",
    "createdAt": "2020-08-31T02:45:09.896Z",
    "updatedAt": "2020-08-31T02:45:09.896Z",
    "parent": null,
    "ownerEmail": "test@test.com"
  },
  {
    "id": 2,
    "name": "Bing",
    "url": "https://bing.com",
    "createdAt": "2020-08-31T02:46:36.882Z",
    "updatedAt": "2020-08-31T02:46:36.882Z",
    "parent": null,
    "ownerEmail": "test@test.com"
  }
]
```

### Detail

#### Request

```sh
GET /bookmarks/1 HTTP/1.1
Authorization: <jwt>
Content-Type: application/json
```

#### Sample Response

```json
{
  "id": 1,
  "name": "DuckDuckGo",
  "url": "https://start.duckduckgo.com",
  "createdAt": "2020-08-31T02:45:09.896Z",
  "updatedAt": "2020-08-31T05:29:20.828Z",
  "parent": null,
  "ownerEmail": "test@test.com"
}
```

### Update

#### Request

```sh
PATCH /bookmarks/1 HTTP/1.1
Authorization: <jwt>
Content-Type: application/json

{
    "name": "DuckDuckGo",
    "url": "https://start.duckduckgo.com"
}
```

#### Sample Response

```json
{
  "bookmark": {
    "id": 1,
    "name": "DuckDuckGo",
    "url": "https://start.duckduckgo.com",
    "createdAt": "2020-08-31T02:45:09.896Z",
    "updatedAt": "2020-08-31T05:29:20.828Z",
    "parent": null,
    "ownerEmail": "test@test.com"
  },
  "issues": []
}
```

### Delete

Note: deletion will not send a response body, only a status code of 204 for success

#### Request

```sh
DELETE /bookmarks/1 HTTP/1.1
Authorization: <jwt>
```

# Development

## Prerequisites

- node
- yarn
- node version manager

## Running the Application

```bash
# Install project dependencies
cd /path/to/bookmarks-backend
nvm use
yarn
```

```sh
# Run the application in development
DATABASE_URI=<uri-to-stage-postgres> yarn dev
```

# Usage with Docker

## Prerequisites

- server w/ docker installed

## Running in production

```sh
git clone https://github.com/charliecrouse/bookmarks-backend.git
cd bookmarks-backend
NODE_ENV=production DATABASE_URI=<uri-to-production-postgres> PORTS=<port> docker-compose up
=======
# Backend API for a bookmarks application

## Documentation

### Authentication

#### Signup

Request

```bash
POST /signup
{
  "email": "<email>",
  "password": "<password>"
}
```

Response

```bash
201 Created
{
    "message": "Successfully signed up!",
    "token": {
        "jwt": "<string>",
        "ownerEmail": "<string>"
    },
    "user": {
        "createdAt": "<Date>",
        "email": "<string>",
        "password": "<string>",
        "updatedAt": "<Date>"
    }
}
```

#### Signin

Request

```bash
POST /signin
{
  "email": "<string>",
  "password": "<string>"
}
```

Response

```bash
200 Ok
{
    "message": "Successfully signed in!",
    "token": {
        "jwt": "<string>",
        "ownerEmail": "<string>"
    },
    "user": {
        "createdAt": "<Date>",
        "email": "<string>",
        "password": "<string>",
        "updatedAt": "<string>"
    }
}
```

Note: authenticated requests can be sent by setting the `Authorization` header to `Bearer <jwt>` or adding the returned JWT as a query param (eg. http://example.com/endpoint?jwt=\<jwt\>)

### Bookmarks

All requests must be authenticated.

#### Fetch Bookmarks

Request

```bash
GET /bookmarks
```

Response

```bash
200 Ok
{
    "bookmarks": [{
      "id": "<number>",
      "name": "<string>",
      "url": "<string | null>"
      "parent": "<number | null>",
      "ownerEmail": "<string>",
      "createdAt": "<Date>",
      "updatedAt": "<Date>",
    }]
    "message": "Successfully fetched bookmarks!"
}
```

#### Create Bookmarks

Request

```Bash
POST /bookmarks
{
  "name": "<string>",
  "url": "<string | null>",
  "parent": "<number | null>"
}
```

Response

```Bash
201 Created
{
    "bookmark": {
        "id": "<number>",
        "name": "<string>",
        "url": "<string | null>",
        "parent": "<number | null>",
        "ownerEmail": "<string>",
        "createdAt": "<Date>",
        "updatedAt": "<Date>"
    },
    "message": "Successfully created new bookmark!"
}
```

#### Bookmark Detail

```Bash
GET /bookmarks/:id
```

Response

```Bash
200 Ok
{
    "bookmark": {
        "id": "<number>",
        "name": "<string>",
        "url": "<string | null>",
        "parent": "<number | null>",
        "ownerEmail": "<string>",
        "createdAt": "<Date>",
        "updatedAt": "<Date>"
    },
    "message": "Successfully fetched bookmark!"
}
```

#### Update Bookmark

```Bash
PATCH /bookmarks/:id
{
  "name": "<string | null>",
  "url": "<string | null>",
  "parent": "<number | null>"
}
```

Response

```Bash
202 Accepted
{
    "bookmark": {
        "id": "<number>",
        "name": "<string>",
        "url": "<string | null>",
        "parent": "<number | null>",
        "ownerEmail": "<string>",
        "createdAt": "<Date>",
        "updatedAt": "<Date>"
    },
    "message": "Successfully updated bookmark!"
}
```

#### Delete Bookmark

```Bash
DELETE /bookmarks/:id
```

Response

```Bash
200 Ok
{
    "bookmark": {
        "id": "<number>",
        "name": "<string>",
        "url": "<string | null>",
        "parent": "<number | null>",
        "ownerEmail": "<string>",
        "createdAt": "<Date>",
        "updatedAt": "<Date>"
    },
    "message": "Successfully fetched bookmark!"
}
```

## Development

Feel free to make a PR.

### Getting Started

Make sure you have the following dependencies installed:

- Node.js and NPM
- g++
- python

### Installing Dependencies

```bash
npm install
```

### Building the application

Recommended if running in production:

```bash
npm run build
```

### Running the Application

First make sure you have a postgres instance running (the easiest way is through Docker: `make db`)

```bash
# Running in development
npm run dev

# Running in production (be sure to build first!)
npm run start
```

### Docker

#### Makefile

```bash
# Build the image
NODE_ENV=<NODE_ENV> make build

# Run image in container
PORT=3000 make run

# Run the database (postgres instance)
make db
```

#### Compose

```bash
# Run the application and database using docker-compose
NODE_ENV=<NODE_ENV> PORT=<PORT> docker-compose up -d
>>>>>>> c96c8bab99e646772a08bc6cbaa6d8cf99c5d6cf
```
