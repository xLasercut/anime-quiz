import { AbstractModel } from './abstract';
import { IGameGuess, IGameLoginData, IGameSettings } from '../shared/interfaces';
import { gameGuessSchema, gameLoginSchema, gameSettingsSchema } from '../schemas/game';

class GameGuess extends AbstractModel<IGameGuess> {
  constructor(guess: IGameGuess) {
    super(gameGuessSchema, guess);
  }
}

class GameLoginData extends AbstractModel<IGameLoginData> {
  constructor(loginData: IGameLoginData) {
    super(gameLoginSchema, loginData);
  }
}

class GameSettings extends AbstractModel<IGameSettings> {
  constructor(settings: IGameSettings) {
    super(gameSettingsSchema, settings);
  }
}

export { GameGuess, GameLoginData, GameSettings };
