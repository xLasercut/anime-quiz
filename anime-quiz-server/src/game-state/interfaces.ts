import {GameRoomSettingsType} from "../shared/models/types";

interface GameRoom {
  sids: Set<string>;
  settings: GameRoomSettingsType
}

export { GameRoom };
