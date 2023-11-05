import { defineStore } from 'pinia';
import { GamePlayerType } from '@/assets/shared/models/types';

interface State {
  playerList: GamePlayerType[];
}

const useGameStore = defineStore('game', {
  state: (): State => {
    return {
      playerList: []
    };
  },
  actions: {
    updatePlayerList(playerList: GamePlayerType[]) {
      this.playerList = playerList;
    }
  }
});

export { useGameStore };
