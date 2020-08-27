import {IAwqSettings} from '../../../../shared/interfaces/awq'

class AwqSettings {
  public weaponCount = 20
  public guessTime = 10
  public duplicate = false

  public update(settings: IAwqSettings): void {
    this.weaponCount = settings.weaponCount
    this.guessTime = settings.guessTime
    this.duplicate = settings.duplicate
  }

  public serialize(): IAwqSettings {
    return {
      weaponCount: this.weaponCount,
      guessTime: this.guessTime,
      duplicate: this.duplicate
    }
  }
}

export {AwqSettings}
