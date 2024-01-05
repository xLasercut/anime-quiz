# Anime Quiz Server

## Prerequisites
- docker
- node js 18+
  - pnpm installed
- docker-compose
- sqlite3
- created discord application with oauth2 enabled and redirects setup

## First time setup

### Creating user song database
If user song database does not exist. create new user db by running
```bash
pnpm bootstrap
```

### Setting up server config
create a file called `config.env`

input server settings
```dotenv
DISCORD_CLIENT_ID=<discord_oauth_client_id>
DISCORD_CLIENT_SECRET=<discord_oauth_client_secret>
REDIRECT_URL=[defaults to http://localhost:8080/anime-quiz/]
```

## Running locally
run command:
```bash
pnpm dev
```

## Running via docker
at root of repo, run command:
```bash
docker compose build
docker compose up
```
