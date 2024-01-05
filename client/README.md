# Anime Quiz Client

## Prerequisites
- node js 18+
  - pnpm installed
- created discord application with oauth2 enabled and redirects setup

## First time setup
### Setting up client config
create a file called `.env`

input client settings
```dotenv
VITE_DISCORD_CLIENT_ID=<discord_oauth_client_id>
VITE_REDIRECT_URL=<discord_oauth_redirect_url>
VITE_CLIENT_VERSION=<client_version_to_be_displayed>
```

## Running locally
run command:
```bash
pnpm dev
```

## Build for github-pages
run command:
```bash
pnpm build
```
