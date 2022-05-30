# Anime Quiz
Rewrite and successor of [Anime Music Quiz](https://github.com/xLasercut/anime-music-quiz)

## Prerequisites
- docker
- node js
- docker-compose
- ngrok account

## Running server
In root of project, create a file called `production.env`

input server passwords and ngrok token
```dotenv
SERVER_PASSWORD=
ADMIN_PASSWORD=
```

Then run commands based on cpu architecture.

arm:
```bash
make build-server-arm
make run-server-arm-prod
```

x86_64:
```bash
make build-server-x86
make run-server-x86-prod
```

## Adding user song lists
Create <filename>.json in `server/data/amq-user` with a blank list, then restart the server.

e.g. user1.json
```json
[]
````
You can then add songs to the list by going to song list editor via the client

## Running client
In root of project
```bash
make run-client
```
