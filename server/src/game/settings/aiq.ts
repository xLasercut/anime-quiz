import {IAiqSettings} from '../../../../shared/interfaces/aiq'

class AiqSettings {
  public imageCount = 20
  public guessTime = 20
  public duplicate = false
  public minFactor = 20
  public maxFactor = 40

  public update(settings: IAiqSettings): void {
    this.imageCount = settings.imageCount
    this.guessTime = settings.guessTime
    this.duplicate = settings.duplicate
    this.minFactor = settings.minFactor
    this.maxFactor = settings.maxFactor
  }

  public serialize(): IAiqSettings {
    return {
      imageCount: this.imageCount,
      guessTime: this.guessTime,
      duplicate: this.duplicate,
      minFactor: this.minFactor,
      maxFactor: this.maxFactor
    }
  }
}

export {AiqSettings}
