import { TServerConfig } from '../interfaces';
import axios from 'axios';
import { Logger } from 'winston';

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
  protected _config: TServerConfig;
  protected _logger: Logger;
  protected _tokenUrl: string = 'https://discord.com/api/oauth2/token';
  protected _userInfoUrl: string = 'https://discord.com/api/users/@me';

  constructor(config: TServerConfig, logger: Logger) {
    this._config = config;
    this._logger = logger;
  }

  public async getUserInfo(code: string): Promise<DiscordUserApiResponse> {
    if (this._config.discordUserOverride) {
      this._logger.debug('user override', {
        id: this._config.discordUserOverride
      });
      return {
        id: this._config.discordUserOverride,
        username: 'overrideuser'
      };
    }

    const accessToken = await this._getAccessToken(code);
    const response = await axios.get<DiscordUserApiResponse>(this._userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    this._logger.info('fetched discord user info', {
      response: response.data
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
        code: `${code}`,
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
