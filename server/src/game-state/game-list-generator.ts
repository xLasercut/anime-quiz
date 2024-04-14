import { GAME_MODES } from 'anime-quiz-shared-resources/src/game-modes';
import { TGameRoomSettings, TUserId } from 'anime-quiz-shared-resources/src/models/types';
import { NormalGameListGenerator } from './game-list-generators/normal';
import { GameListGenerator } from './game-list-generators/common';
import { BalancedPlusGameListGenerator } from './game-list-generators/balanced-plus';
import { BalancedGameListGenerator } from './game-list-generators/balanced';
import { ShiritoriGameListGenerator } from './game-list-generators/shiritori';
import { THandlerDependencies } from '../interfaces';

const _GENERATOR_MAP = {
  [GAME_MODES.NORMAL]: NormalGameListGenerator,
  [GAME_MODES.BALANCED_PLUS]: BalancedPlusGameListGenerator,
  [GAME_MODES.BALANCED]: BalancedGameListGenerator,
  [GAME_MODES.SHIRITORI]: ShiritoriGameListGenerator
};

class GameListGeneratorFactory {
  protected _dependencies: THandlerDependencies;

  constructor(dependencies: THandlerDependencies) {
    this._dependencies = dependencies;
  }

  public getGenerator(settings: TGameRoomSettings, players: TUserId[]): GameListGenerator {
    if (settings.gameMode in _GENERATOR_MAP) {
      return new _GENERATOR_MAP[settings.gameMode](this._dependencies, settings, players);
    }
    return new NormalGameListGenerator(this._dependencies, settings, players);
  }
}

export { GameListGeneratorFactory };
