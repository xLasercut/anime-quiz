import { Socket } from 'socket.io-client';
import { pinia } from '@/plugins/store';
import { GameGuess, GamePlayer, GameRoomState, SOCKET_EVENTS, TGameGuess, TGamePlayer, TGameRoomState } from 'anime-quiz-shared-resources';
import { useGameStore } from '@/plugins/store/game';
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
