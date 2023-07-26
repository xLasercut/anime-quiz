import { ServerConfig } from '../interfaces';
import axios from 'axios';

interface DiscordTokenApiResponse {
  token_type: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

interface DiscordUserApiResponse {
  id: string;
  username: string;
  avatar?: string;
  global_name?: string;
}

class Oidc {
  protected _config: ServerConfig;
  protected _authUrl: string = 'https://discord.com/oauth2/authorize';
  protected _tokenUrl: string = 'https://discord.com/api/oauth2/token';
  protected _userInfoUrl: string = 'https://discord.com/api/users/@me';

  constructor(config: ServerConfig) {
    this._config = config;
  }

  public getAuthorizeUrl(): string {
    const urlParams = [
      `client_id=${this._config.discordClientId}`,
      'scope=identify',
      'response_type=code',
      `redirect_uri=${encodeURIComponent(this._config.redirectUrl)}`
    ];
    return `${this._authUrl}?${urlParams.join('&')}`;
  }

  public async getUserInfo(code: string): Promise<DiscordUserApiResponse> {
    const accessToken = await this._getAccessToken(code);
    const response = await axios.get<DiscordUserApiResponse>(this._userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  }

  protected async _getAccessToken(code: string): Promise<string> {
    const response = await axios.post<DiscordTokenApiResponse>(
      this._tokenUrl,
      {
        client_id: this._config.discordClientId,
        client_secret: this._config.discordClientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this._config.redirectUrl
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return response.data.access_token;
  }
}

export { Oidc };
