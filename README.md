# Anime Quiz
Rewrite and successor of [Anime Music Quiz](https://github.com/xLasercut/anime-music-quiz)

## Prerequisites
- docker
- node js
- docker-compose

## Running server
### Locally
create new user db by running
```bash
npm run init:userdb
```

In server directory, create a file called `config.env`

input server passwords
```dotenv
SERVER_PASSWORD=
ADMIN_PASSWORD=
```

Then run command:
```bash
npm run dev:server
```

### Docker
create new user db by running
```bash
npm run init:userdb
```

In server directory, create a file called `config.env`

input server passwords
```dotenv
SERVER_PASSWORD=
ADMIN_PASSWORD=
```

Then run command:
```bash
docker compose build
docker compose up
```

## Adding user song lists
Add new user lists by logging in to the client with admin credentials

You can then add songs to the list by going to song list editor via the client

## Running client
In root of project
```bash
npm run dev:client
```
