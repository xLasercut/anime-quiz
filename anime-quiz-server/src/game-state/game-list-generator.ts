import { UserSongDb } from '../database/user-song';
import { GAME_MODES } from '../shared/game-modes';
import { GameRoomSettingsType, UserIdType } from '../shared/models/types';
import { NormalGameListGenerator } from './game-list-generators/normal';
import {SongDb} from "../database/song";
import {GameListGenerator} from "./game-list-generators/common";

const _GENERATOR_MAP = {
  [GAME_MODES.NORMAL]: NormalGameListGenerator,
  // [GAME_MODES.BALANCED_PLUS]: BalancedPlusGameListGenerator,
  // [GAME_MODES.BALANCED]: BalancedGameListGenerator,
  // [GAME_MODES.SHIRITORI]: ShiritoriGameListGenerator
};

class GameListGeneratorFactory {
  protected _userSongDb: UserSongDb;
  protected _songDb: SongDb

  constructor(userSongDb: UserSongDb, songDb: SongDb) {
    this._userSongDb = userSongDb;
    this._songDb = songDb
  }

  public getGenerator(settings: GameRoomSettingsType, players: UserIdType[]): GameListGenerator {
    if (settings.gameMode in _GENERATOR_MAP) {
      return new _GENERATOR_MAP[settings.gameMode](this._userSongDb, this._songDb, settings, players);
    }
    return new NormalGameListGenerator(this._userSongDb, this._songDb, settings, players);
  }
}

export { GameListGeneratorFactory };
