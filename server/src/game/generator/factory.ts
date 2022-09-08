import { NormalGameListGenerator } from './normal';
import { BalancedPlusGameListGenerator } from './balanced-plus';
import { BalancedGameListGenerator } from './balanced';
import { ShiritoriGameListGenerator } from './shiritori';
import { SongDb } from '../../database/song';
import { UserDb } from '../../database/user';
import { IGameSettings } from '../../shared/interfaces';
import { BALANCED, BALANCED_PLUS, NORMAL, SHIRITORI } from '../../shared/constants/game-modes';

const _GENERATOR_MAP = {
  [NORMAL]: NormalGameListGenerator,
  [BALANCED_PLUS]: BalancedPlusGameListGenerator,
  [BALANCED]: BalancedGameListGenerator,
  [SHIRITORI]: ShiritoriGameListGenerator
};

class GameListGeneratorFactory {
  protected _songDb: SongDb;
  protected _userDb: UserDb;

  constructor(songDb: SongDb, userDb: UserDb) {
    this._songDb = songDb;
    this._userDb = userDb;
  }

  public getGenerator(settings: IGameSettings) {
    if (settings.gameMode in _GENERATOR_MAP) {
      return new _GENERATOR_MAP[settings.gameMode](this._songDb, this._userDb, settings);
    }
    return new NormalGameListGenerator(this._songDb, this._userDb, settings);
  }
}

export { GameListGeneratorFactory };
