import { Logger } from '../app/logging/logger';
import { SANITIZE_MAP } from '../constants';
import { IGameAvatar, IGameChatMessage } from '../shared/interfaces';
import { ISocket } from '../types';
import { EVA_UNIT_1 } from '../shared/constants/avatars';

class ChatManager {
  protected _logger: Logger;

  constructor(logger: Logger) {
    this._logger = logger;
  }

  public generateUserMsg(socket: ISocket, msg: string): IGameChatMessage {
    return this._generateChatMsg(
      socket.data.username,
      socket.data.admin,
      socket.data.avatar,
      socket.id,
      msg
    );
  }

  public generateSysMsg(msg: string): IGameChatMessage {
    return this._generateChatMsg('Eva Unit-01', false, EVA_UNIT_1, 'system_message', msg);
  }

  protected _generateChatMsg(
    username: string,
    admin: boolean,
    avatar: IGameAvatar,
    sid: string,
    msg: string
  ): IGameChatMessage {
    return {
      username: username,
      admin: admin,
      avatar: avatar,
      sid: sid,
      repeat: false,
      text: this._sanitizeMsg(msg)
    };
  }

  protected _sanitizeMsg(msg: string): string {
    let output = msg;
    for (const key in SANITIZE_MAP) {
      output = output.replace(new RegExp(key, 'g'), SANITIZE_MAP[key]);
    }
    return output;
  }
}

export { ChatManager };
