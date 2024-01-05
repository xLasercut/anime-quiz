/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DISCORD_CLIENT_ID: string;
  readonly VITE_REDIRECT_URL: string;
  readonly VITE_CLIENT_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
