import { GAME_MODE } from '../../shared/constants';
import { NormalGameListGenerator } from './normal';
import { BalancedPlusGameListGenerator } from './balanced-plus';
import { BalancedGameListGenerator } from './balanced';
import { ShiritoriGameListGenerator } from './shiritori';
import { AnimeQuizSongDb } from '../../database/song';
import { AnimeQuizUserDb } from '../../database/user';
import { AqGameSettings } from '../../shared/interfaces';

const _GENERATOR_MAP = {
  [GAME_MODE.NORMAL]: NormalGameListGenerator,
  [GAME_MODE.BALANCED_PLUS]: BalancedPlusGameListGenerator,
  [GAME_MODE.BALANCED]: BalancedGameListGenerator,
  [GAME_MODE.SHIRITORI]: ShiritoriGameListGenerator
};

class GameListGeneratorFactory {
  protected _songDb: AnimeQuizSongDb;
  protected _userDb: AnimeQuizUserDb;

  constructor(songDb: AnimeQuizSongDb, userDb: AnimeQuizUserDb) {
    this._songDb = songDb;
    this._userDb = userDb;
  }

  public getGenerator(settings: AqGameSettings) {
    if (settings.gameMode in _GENERATOR_MAP) {
      return new _GENERATOR_MAP[settings.gameMode](this._songDb, this._userDb, settings);
    }
    return new NormalGameListGenerator(this._songDb, this._userDb, settings);
  }
}

export { GameListGeneratorFactory };
