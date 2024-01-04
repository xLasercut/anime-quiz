import { Socket } from 'socket.io-client';
import { pinia } from '@/plugins/store';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import {GamePlayerType, GameRoomStateType} from '@/assets/shared/models/types';
import { useGameStore } from '@/plugins/store/game';
import {GamePlayer, GameRoomState} from '@/assets/shared/models/game';

const gameStore = useGameStore(pinia);

function startGameStoreListeners(socket: Socket) {
  socket.on(SOCKET_EVENTS.UPDATE_STORE_PLAYER_LIST, (_playerList: GamePlayerType[]) => {
    const playerList = _playerList.map((item) => GamePlayer.parse(item));
    gameStore.updatePlayerList(playerList);
  });

  socket.on(SOCKET_EVENTS.UPDATE_STORE_GAME_STATE, (_gameState: GameRoomStateType) => {
    const gameState = GameRoomState.parse(_gameState)
    gameStore.updateGameState(gameState)
  })
}

export { startGameStoreListeners };
