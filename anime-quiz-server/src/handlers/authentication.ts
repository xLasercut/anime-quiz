import { AbstractHandler } from './common';
import { SOCKET_EVENTS } from '../shared/events';

class OidcHandler extends AbstractHandler {
  public start() {
    this._socket.on(
      SOCKET_EVENTS.GET_AUTHORIZE_URL,
      this._errHandler((callback: Function) => {
        callback(this._oidc.getAuthorizeUrl());
      })
    );

    this._socket.on(
      SOCKET_EVENTS.AUTHORIZE_USER,
      this._errHandler(async (code: string, callback: Function) => {
        const discordUser = await this._oidc.getUserInfo(code);
        const dbUser = this._userDb.getUserInfo(discordUser.id);
        this._socket.data.authorizeClient(dbUser);
        callback(this._socket.data.clientData);
      })
    );
  }
}

export { OidcHandler };
