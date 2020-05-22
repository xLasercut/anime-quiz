import {IAmqGameMode} from '../../../../shared/types/amq'
import {IAmqSettings} from '../../../../shared/interfaces/amq'

class AmqSettings {
  public songCount = 20
  public guessTime = 30
  public gameMode: IAmqGameMode = 'normal'
  public duplicate = false
  public selectTime = 20
  public users: Array<string> = []
  public leastPlayed = false

  public serialize(): IAmqSettings {
    return {
      songCount: this.songCount,
      guessTime: this.guessTime,
      gameMode: this.gameMode,
      duplicate: this.duplicate,
      selectTime: this.selectTime,
      users: this.users,
      leastPlayed: this.leastPlayed
    }
  }
}

export {AmqSettings}
