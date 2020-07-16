import {AmqRoomManager} from '../rooms/amq'
import {GameDataError} from '../../exceptions'
import {IAmqReadyType} from '../../../../shared/types/amq'

class AmqTimer {
  protected _countDowns: { [key: string]: NodeJS.Timeout } = {}
  protected _timeOuts: { [key: string]: NodeJS.Timeout } = {}
  protected _roomManager: AmqRoomManager

  constructor(roomManager: AmqRoomManager) {
    this._roomManager = roomManager
  }

  public async startCountdown(roomId: string, maxTime: number, readyType: IAmqReadyType, socketId: string = null): Promise<any> {
    this.resetCountdown(roomId)
    let time = 0
    return new Promise((resolve, reject) => {
      this._countDowns[roomId] = setInterval(() => {
        if (this._roomManager.isAmqRoom(roomId)) {
          time += 500
          if (time >= maxTime) {
            this.resetCountdown(roomId)
            resolve(true)
          }
          else if (socketId && this._roomManager.singlePlayerReady(socketId, readyType)) {
            this.resetCountdown(roomId)
            resolve(true)
          }
          else if (this._roomManager.allPlayerReady(roomId, readyType)) {
            this.resetCountdown(roomId)
            resolve(true)
          }
        }
        else {
          this.resetCountdown(roomId)
        }
      }, 500)
    })
  }

  public async startTimeout(roomId: string, time: number): Promise<any> {
    this.resetTimeout(roomId)
    return new Promise((resolve, reject) => {
      this._timeOuts[roomId] = setTimeout(() => {
        this.resetTimeout(roomId)
        resolve(true)
      }, time)
    })
  }

  public resetTimeout(roomId: string): void {
    if (roomId in this._timeOuts) {
      clearTimeout(this._timeOuts[roomId])
      delete this._timeOuts[roomId]
    }
  }

  public resetCountdown(roomId: string): void {
    if (roomId in this._countDowns) {
      clearInterval(this._countDowns[roomId])
      delete this._countDowns[roomId]
    }
  }
}

export {AmqTimer}
