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
```
