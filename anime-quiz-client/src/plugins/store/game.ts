import { defineStore } from 'pinia';
import { GamePlayerType, GameRoomStateType, SongType } from '@/assets/shared/models/types';

interface State {
  playerList: GamePlayerType[];
  currentSong: SongType;
  playing: boolean;
  currentSongCount: number;
  maxSongCount: number;
}

const useGameStore = defineStore('game', {
  state: (): State => {
    return {
      playerList: [],
      currentSong: {
        songId: '',
        src: 'https://v.animethemes.moe/MahoutsukaiNoYome-OP1-Lyrics.webm',
        type: 'OP',
        songTitle: '',
        artist: '',
        animeName: [],
        animeId: []
      },
      playing: false,
      currentSongCount: 0,
      maxSongCount: 0
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
    }
  }
});

export { useGameStore };
