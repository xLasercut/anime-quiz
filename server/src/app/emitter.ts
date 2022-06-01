import { SHARED_EVENTS } from '../shared/events'
import {
  AqAnime,
  AqClientData, AqEmoji,
  AqGameChatMessage,
  AqGameGuess,
  AqGamePlayer,
  AqGameSettings,
  AqGameState,
  AqSong,
  AqUserSongs
} from '../shared/interfaces'
import { Server } from './server'

class Emitter {
  protected _io: Server

  constructor(io: Server) {
    this._io = io
  }

  public updateEmojiList(emojiList: AqEmoji[], sid: string = null): void {
    this._client(sid).emit(SHARED_EVENTS.UPDATE_EMOJI_LIST, emojiList)
  }

  public systemNotification(color: string, message: string, sid: string = null): void {
    this._client(sid).emit(SHARED_EVENTS.SYSTEM_NOTIFICATION, color, message)
  }

  public updateSongList(songList: AqSong[], sid: string = null): void {
    this._client(sid).emit(SHARED_EVENTS.UPDATE_SONG_LIST, songList)
  }

  public updateAnimeList(animeList: string[], sid: string = null): void {
    this._client(sid).emit(SHARED_EVENTS.UPDATE_ANIME_LIST, animeList)
  }

  public adminUpdateAnimeList(animeList: AqAnime[], sid: string): void {
    this._client(sid).emit(SHARED_EVENTS.ADMIN_UPDATE_ANIME_LIST, animeList)
  }

  public adminUpdateSongList(songList: AqSong[], sid: string): void {
    this._client(sid).emit(SHARED_EVENTS.ADMIN_UPDATE_SONG_LIST, songList)
  }

  public adminUpdateEmojiList(emojiList: AqEmoji[], sid: string): void {
    this._client(sid).emit(SHARED_EVENTS.ADMIN_UPDATE_EMOJI_LIST, emojiList)
  }

  public updateSongTitleList(songTitleList: string[], sid: string = null): void {
    this._client(sid).emit(SHARED_EVENTS.UPDATE_SONG_TITLE_LIST, songTitleList)
  }

  public updateUserLists(userLists: AqUserSongs[], sid: string = null): void {
    this._client(sid).emit(SHARED_EVENTS.UPDATE_USER_LISTS, userLists)
  }

  public updateRoomList(roomList: string[], sid: string = null): void {
    this._client(sid).emit(SHARED_EVENTS.UPDATE_ROOM_LIST, roomList)
  }

  public updateGameChat(msg: AqGameChatMessage, sid: string = null): void {
    this._client(sid).emit(SHARED_EVENTS.UPDATE_GAME_CHAT, msg)
  }

  public updateGameSetting(settings: AqGameSettings, sid: string = null): void {
    this._client(sid).emit(SHARED_EVENTS.UPDATE_GAME_SETTINGS, settings)
  }

  public updateClientData(clientData: AqClientData, sid: string): void {
    this._client(sid).emit(SHARED_EVENTS.UPDATE_CLIENT_DATA, clientData)
  }

  public updateGamePlayerList(playerList: AqGamePlayer[], sid: string): void {
    this._client(sid).emit(SHARED_EVENTS.UPDATE_GAME_PLAYERS, playerList)
  }

  public updateGuess(guess: AqGameGuess, sid: string): void {
    this._client(sid).emit(SHARED_EVENTS.UPDATE_GUESS, guess)
  }

  public updateGameState(gameState: AqGameState, sid: string = null): void {
    this._client(sid).emit(SHARED_EVENTS.UPDATE_GAME_STATE, gameState)
  }

  public gameNewRound(sid: string): void {
    this._client(sid).emit(SHARED_EVENTS.GAME_NEW_ROUND)
  }

  public gameStartLoad(startPosition: number, guessTime: number, sid: string): void {
    this._client(sid).emit(SHARED_EVENTS.GAME_START_LOAD, startPosition, guessTime)
  }

  public gameStartCountdown(sid: string): void {
    this._client(sid).emit(SHARED_EVENTS.GAME_START_COUNTDOWN)
  }

  public gameShowGuess(sid: string): void {
    this._client(sid).emit(SHARED_EVENTS.GAME_SHOW_GUESS)
  }

  public stopClientGame(sid: string): void {
    this._client(sid).emit(SHARED_EVENTS.STOP_CLIENT_GAME)
  }

  protected _client(sid: string) {
    if (sid) {
      return this._io.to(sid)
    }
    return this._io
  }
}

export {
  Emitter
}
