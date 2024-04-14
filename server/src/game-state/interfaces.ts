import { GameSettings } from './settings';
import { GameState } from './state';

interface TGameRoom {
  settings: GameSettings;
  state: GameState;
}

export { TGameRoom };
