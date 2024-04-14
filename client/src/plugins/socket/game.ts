import { Socket } from 'socket.io-client';
import { pinia } from '@/plugins/store';
import { SOCKET_EVENTS } from 'anime-quiz-shared-resources/src/events';
import { TGameGuess, TGamePlayer, TGameRoomState } from 'anime-quiz-shared-resources/src/models/types';
import { useGameStore } from '@/plugins/store/game';
import { GameGuess, GamePlayer, GameRoomState } from 'anime-quiz-shared-resources/src/models/game';
import { useClientStore } from '@/plugins/store/client';

const gameStore = useGameStore(pinia);
const clientStore = useClientStore(pinia);

function startGameStoreListeners(socket: Socket) {
  socket.on(SOCKET_EVENTS.UPDATE_STORE_PLAYER_LIST, (_playerList: TGamePlayer[]) => {
    const playerList = _playerList.map((item) => GamePlayer.parse(item));
    gameStore.updatePlayerList(playerList);
  });

  socket.on(SOCKET_EVENTS.UPDATE_STORE_GAME_STATE, (_gameState: TGameRoomState) => {
    const gameState = GameRoomState.parse(_gameState);
    gameStore.updateGameState(gameState, clientStore.audioOnly);
  });

  socket.on(SOCKET_EVENTS.UPDATE_STORE_GAME_GUESS, (_guess: TGameGuess) => {
    const gameGuess = GameGuess.parse(_guess);
    gameStore.updateGameGuess(gameGuess);
  });
}

export { startGameStoreListeners };
