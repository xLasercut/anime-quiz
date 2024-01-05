import { LOCAL_STORAGE_CONSTANTS } from '@/assets/constants';
import { v4 as uuid4 } from 'uuid';

const AUTH_URL_BASE = 'https://discord.com/oauth2/authorize';

function getAuthorizeUrl(): string {
  const oauthState = uuid4();
  const urlParams = [
    `client_id=${import.meta.env.VITE_DISCORD_CLIENT_ID}`,
    'scope=identify',
    'response_type=code',
    `redirect_uri=${encodeURIComponent(import.meta.env.VITE_REDIRECT_URL)}`,
    `state=${oauthState}`,
    'prompt=none'
  ];
  localStorage[LOCAL_STORAGE_CONSTANTS.OAUTH_STATE] = oauthState;
  return `${AUTH_URL_BASE}?${urlParams.join('&')}`;
}

export { getAuthorizeUrl };
