const AUTH_URL_BASE = 'https://discord.com/oauth2/authorize';

function getAuthorizeUrl(): string {
  const urlParams = [
    `client_id=${import.meta.env.VITE_DISCORD_CLIENT_ID}`,
    'scope=identify',
    'response_type=code',
    `redirect_uri=${encodeURIComponent(import.meta.env.VITE_REDIRECT_URL)}`
  ];
  return `${AUTH_URL_BASE}?${urlParams.join('&')}`;
}

export { getAuthorizeUrl };
