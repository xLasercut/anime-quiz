import {AbstractHandler} from './abstract'
import {AwqWeaponDatabase} from '../database/awq-weapon'
import {ISocket} from '../interfaces'
import {LOG_BASE, Logger} from '../app/logging'
import {Emitter} from '../app/emitter'
import {IAwqWeapon} from '../../../shared/interfaces/database'
import {ROOM_IDS} from '../config'

class AwqWeaponListHandler extends AbstractHandler {
  protected _weaponDatabase: AwqWeaponDatabase
  protected _roomId = ROOM_IDS.awqWeaponList

  constructor(logger: Logger, emitter: Emitter, weaponDatabase: AwqWeaponDatabase) {
    super(logger, emitter)
    this._weaponDatabase = weaponDatabase
  }

  public start(socket: ISocket, exceptionHandler: Function) {
    socket.on('JOIN_AWQ_WEAPON', exceptionHandler(socket, (): void => {
      socket.join(this._roomId)
      this._logger.writeLog(LOG_BASE.SERVER005, {id: socket.id, roomId: this._roomId})
      this._emitter.updateAwqWeaponList(this._weaponDatabase.getWeaponList(), socket.id)
      this._emitter.updateAwqChoices(this._weaponDatabase.getChoices(), socket.id)
    }))

    socket.on('GET_AWQ_WEAPON_LIST', exceptionHandler(socket, (): void => {
      this._logger.writeLog(LOG_BASE.LIST004, {id: socket.id})
      this._emitter.updateAwqWeaponList(this._weaponDatabase.getWeaponList(), socket.id)
    }))

    socket.on('ADD_AWQ_GAME_WEAPON', exceptionHandler(socket, (weapon: IAwqWeapon): void => {
      this._logger.writeLog(
        LOG_BASE.LIST005,
        Object.assign({}, {id: socket.id, operation: 'add'}, weapon)
      )
      this._weaponDatabase.addWeapon(weapon)
      this._weaponDatabase.loadSecondaryData()
      this._emitter.updateAwqWeaponList(this._weaponDatabase.getWeaponList(), this._roomId)
      this._emitter.updateAwqChoices(this._weaponDatabase.getChoices())
      this._emitter.systemNotification('success', `${weapon.anime[0]}: ${weapon.name} added`, socket.id)
    }))

    socket.on('EDIT_AWQ_GAME_WEAPON', exceptionHandler(socket, (weapon: IAwqWeapon): void => {
      this._logger.writeLog(
        LOG_BASE.LIST005,
        Object.assign({}, {id: socket.id, operation: 'edit'}, weapon)
      )
      this._weaponDatabase.editWeapon(weapon)
      this._weaponDatabase.loadSecondaryData()
      this._emitter.updateAwqWeaponList(this._weaponDatabase.getWeaponList(), this._roomId)
      this._emitter.updateAwqChoices(this._weaponDatabase.getChoices())
      this._emitter.systemNotification('success', `${weapon.anime[0]}: ${weapon.name} edited`, socket.id)
    }))

    socket.on('DELETE_AWQ_GAME_WEAPON', exceptionHandler(socket, (weapon: IAwqWeapon): void => {
      this._logger.writeLog(
        LOG_BASE.LIST005,
        Object.assign({}, {id: socket.id, operation: 'delete'}, weapon)
      )
      this._weaponDatabase.deleteWeapon(weapon)
      this._weaponDatabase.loadSecondaryData()
      this._emitter.updateAwqWeaponList(this._weaponDatabase.getWeaponList(), this._roomId)
      this._emitter.updateAwqChoices(this._weaponDatabase.getChoices())
      this._emitter.systemNotification('success', `${weapon.anime[0]}: ${weapon.name} deleted`, socket.id)
    }))
  }
}

export {AwqWeaponListHandler}
