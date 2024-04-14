import { defineStore } from 'pinia';
import { SONG_TYPES, TGameGuess, TGamePlayer, TGameRoomState, TSong } from 'anime-quiz-shared-resources';

interface CurrentSongType extends TSong {
  currentSongSrc: string;
}

interface State {
  playerList: TGamePlayer[];
  currentSong: CurrentSongType;
  playing: boolean;
  currentSongCount: number;
  maxSongCount: number;
  gameGuess: TGameGuess;
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
        audioSrc: '',
        currentSongSrc: ''
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
    updatePlayerList(playerList: TGamePlayer[]) {
      this.playerList = playerList;
    },
    updateGameState(gameState: TGameRoomState, audioOnly: boolean) {
      this.currentSong = {
        ...gameState.currentSong,
        currentSongSrc: gameState.currentSong.src
      };
      if (audioOnly && gameState.currentSong.audioSrc) {
        this.currentSong.currentSongSrc = gameState.currentSong.audioSrc;
      }
      this.currentSongCount = gameState.currentSongCount;
      this.maxSongCount = gameState.maxSongCount;
      this.playing = gameState.playing;
    },
    updateGameGuess(gameGuess: TGameGuess) {
      this.gameGuess = gameGuess;
    }
  }
});

export { useGameStore };
