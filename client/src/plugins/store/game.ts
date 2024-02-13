import { defineStore } from 'pinia';
import { GameGuessType, GamePlayerType, GameRoomStateType, SongType } from '@/assets/shared/models/types';
import { SONG_TYPES } from '@/assets/shared/song-types';

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
        type: SONG_TYPES.OP,
        songTitle: '',
        artist: '',
        animeName: [],
        animeId: [],
        audioSrc: ''
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
    updateGameState(gameState: GameRoomStateType, audioOnly: boolean) {
      this.currentSong = gameState.currentSong;
      if (audioOnly && gameState.currentSong.audioSrc) {
        this.currentSong.src = gameState.currentSong.audioSrc;
      }
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
