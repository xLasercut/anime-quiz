import { defineStore } from 'pinia';
import { GamePlayerType, SongType } from '@/assets/shared/models/types';

interface State {
  playerList: GamePlayerType[];
  currentSong: SongType;
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
      }
    };
  },
  actions: {
    updatePlayerList(playerList: GamePlayerType[]) {
      this.playerList = playerList;
    }
  }
});

export { useGameStore };
