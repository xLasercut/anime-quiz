# Anime Quiz
Rewrite and successor of [Anime Music Quiz](https://github.com/xLasercut/anime-music-quiz)

## Prerequisites
- docker
- node js
- docker-compose
- ngrok account

## Running server
### Locally
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
