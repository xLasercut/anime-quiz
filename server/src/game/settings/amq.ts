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

  public update(amqSettings: IAmqSettings): void {
    this.songCount = amqSettings.songCount
    this.guessTime = amqSettings.guessTime
    this.gameMode = amqSettings.gameMode
    this.duplicate = amqSettings.duplicate
    this.selectTime = amqSettings.selectTime
    this.users = amqSettings.users
    this.leastPlayed = amqSettings.leastPlayed
  }

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
