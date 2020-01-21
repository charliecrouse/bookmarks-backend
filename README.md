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
```
