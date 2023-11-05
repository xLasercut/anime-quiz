import { Socket } from 'socket.io-client';
import { pinia } from '@/plugins/store';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import { GamePlayerType } from '@/assets/shared/models/types';
import { useGameStore } from '@/plugins/store/game';
import { GamePlayer } from '@/assets/shared/models/game';

const gameStore = useGameStore(pinia);

function startGameStoreListeners(socket: Socket) {
  socket.on(SOCKET_EVENTS.UPDATE_STORE_PLAYER_LIST, (_playerList: GamePlayerType[]) => {
    const playerList = _playerList.map((item) => GamePlayer.parse(item));
    gameStore.updatePlayerList(playerList);
  });
}

export { startGameStoreListeners };
