import { GameSettings } from './settings';
import {GameState} from "./state";

interface GameRoom {
  settings: GameSettings;
  state: GameState
}

export { GameRoom };
