import { defineStore } from 'pinia';
import { GameGuessType, GamePlayerType, GameRoomStateType, SongType } from '@/assets/shared/models/types';

interface State {
  playerList: GamePlayerType[];
  currentSong: SongType;
  playing: boolean;
  currentSongCount: number;
  maxSongCount: number;
  gameGuess: GameGuessType;
}

const useGameStore = defineStore('game', {
  state: (): State => {
    return {
      playerList: [],
      currentSong: {
        songId: '',
        src: '',
        type: 'OP',
        songTitle: '',
        artist: '',
        animeName: [],
        animeId: []
      },
      playing: false,
      currentSongCount: 0,
      maxSongCount: 0,
      gameGuess: {
        anime: '',
        title: ''
      }
    };
  },
  actions: {
    updatePlayerList(playerList: GamePlayerType[]) {
      this.playerList = playerList;
    },
    updateGameState(gameState: GameRoomStateType) {
      this.currentSong = gameState.currentSong;
      this.currentSongCount = gameState.currentSongCount;
      this.maxSongCount = gameState.maxSongCount;
      this.playing = gameState.playing;
    },
    updateGameGuess(gameGuess: GameGuessType) {
      this.gameGuess = gameGuess;
    }
  }
});

export { useGameStore };
