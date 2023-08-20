import { Logger } from '../app/logger';
import { AvatarType, DisplayNameType, GameChatType, UserIdType } from '../shared/models/types';
import { Socket } from '../types';

const SANITIZE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\\/': '&sol;',
  "'": '&apos;'
};

class GameChatSerialiser {
  protected _logger: Logger;

  constructor(logger: Logger) {
    this._logger = logger;
  }

  public generateUserMsg(socket: Socket, msg: string): GameChatType {
    return this._generateChatMsg(
      socket.data.clientData.displayName,
      socket.data.clientData.admin,
      socket.data.clientData.avatar,
      socket.data.clientData.userId,
      msg
    );
  }

  protected _generateChatMsg(
    displayName: DisplayNameType,
    admin: boolean,
    avatar: AvatarType,
    userId: UserIdType,
    msg: string
  ): GameChatType {
    return {
      displayName: displayName,
      admin: admin,
      avatar: avatar,
      userId: userId,
      repeat: false,
      text: this._sanitiseMsg(msg)
    };
  }

  protected _sanitiseMsg(message: string): string {
    let output = message;
    for (const key in SANITIZE_MAP) {
      output = output.replace(new RegExp(key, 'g'), SANITIZE_MAP[key]);
    }
    return output;
  }
}

export { GameChatSerialiser };
