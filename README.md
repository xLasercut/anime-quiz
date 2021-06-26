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
NGROK_TOKEN=
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

## Running client
In root of project
```bash
make run-client
```
