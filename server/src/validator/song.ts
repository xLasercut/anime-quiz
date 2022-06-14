import { GameDataValidationError } from '../app/exceptions'
import { VALID_SONG_TYPES } from '../shared/constants'
import { AqSong } from '../shared/interfaces'
import { AbstractValidator } from './abstract'

class SongValidator extends AbstractValidator {
  public validateSong(song: AqSong): void {
    this._validateString(song.song_title, 'Invalid title')
    this._validateString(song.src, 'Invalid src')
    this._validateString(song.artist, 'Invalid artist', true)
    this._validateSongType(song.type)
  }

  protected _validateSongType(type: string): void {
    if (!VALID_SONG_TYPES.includes(type)) {
      throw new GameDataValidationError('Invalid type')
    }
  }
}

export { SongValidator }
