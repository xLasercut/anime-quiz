import { AbstractModel } from './abstract';
import { IClientData, IGameGuess, IGameLoginData, IGameSettings } from '../shared/interfaces';
import {
  gameClientSchema,
  gameGuessSchema,
  gameLoginSchema,
  gameSettingsSchema
} from '../schemas/game';

class GameGuess extends AbstractModel<IGameGuess> {
  constructor(guess: IGameGuess) {
    super(gameGuessSchema, guess);
  }
}

class ClientData extends AbstractModel<IClientData> {
  constructor(client: IClientData) {
    super(gameClientSchema, client);
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

export { GameGuess, ClientData, GameLoginData, GameSettings };
