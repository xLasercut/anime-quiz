import {IAWQWeapon} from '../../../shared/interfaces/database'

class AwqWeaponDatabase {
  protected _weaponList: Array<IAWQWeapon>
  protected _weaponIds: Set<string>
  protected _animeChoices: Array<string>
  protected _weaponChoices: Array<string>

  constructor() {
  }

  public loadData(): void {

  }
}

export {AwqWeaponDatabase}
