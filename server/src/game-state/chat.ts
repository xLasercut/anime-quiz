import { Logger } from 'winston';
import { TAvatar, TDisplayName, TGameChat, TUserId } from 'anime-quiz-shared-resources/src/models/types';
import { Socket } from '../types';
import { AVATARS } from 'anime-quiz-shared-resources/src/avatars';
import { BotMessageDb } from '../database/bot-message';

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
  protected _botMessageDb: BotMessageDb;

  constructor(logger: Logger, botMessageDb: BotMessageDb) {
    this._logger = logger;
    this._botMessageDb = botMessageDb;
  }

  public generateBotMsg(msg: string): TGameChat | undefined {
    if (!msg.startsWith('/')) {
      return undefined;
    }

    const command = msg.slice(1);
    const botMessage = this._botMessageDb.getBotMessageByCommand(command);
    if (!botMessage) {
      return undefined;
    }

    return this._generateChatMsg(
      botMessage.displayName,
      false,
      botMessage.avatar,
      botMessage.userId,
      `🎶 🎶 🎶\n${botMessage.text}\n🎶 🎶 🎶`
    );
  }

  public generateUserMsg(socket: Socket, msg: string): TGameChat {
    return this._generateChatMsg(
      socket.data.clientData.displayName,
      socket.data.clientData.admin,
      socket.data.clientData.avatar,
      socket.data.clientData.userId,
      msg
    );
  }

  public generateSystemMsg(msg: string): TGameChat {
    return this._generateChatMsg('Eva Unit-01', false, AVATARS.EVA_UNIT_1, 'user-00000000-0000-0000-0000-000000000000', msg);
  }

  protected _generateChatMsg(displayName: TDisplayName, admin: boolean, avatar: TAvatar, userId: TUserId, msg: string): TGameChat {
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
