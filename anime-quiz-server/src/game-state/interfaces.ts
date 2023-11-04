import { GameSettings } from './settings';

interface GameRoom {
  sids: Set<string>;
  settings: GameSettings;
}

export { GameRoom };
