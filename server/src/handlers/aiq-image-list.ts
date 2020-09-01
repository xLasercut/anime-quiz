import {AbstractHandler} from './abstract'
import {AiqImageDatabase} from '../database/aiq-image'
import {ISocket} from '../interfaces'
import {LOG_BASE, Logger} from '../app/logging'
import {Emitter} from '../app/emitter'
import {IAiqImage} from '../../../shared/interfaces/database'
import {ROOM_IDS} from '../config'

class AiqImageListHandler extends AbstractHandler {
  protected _imageDatabase: AiqImageDatabase
  protected _roomId = ROOM_IDS.awqImageList

  constructor(logger: Logger, emitter: Emitter, imageDatabase: AiqImageDatabase) {
    super(logger, emitter)
    this._imageDatabase = imageDatabase
  }

  public start(socket: ISocket, exceptionHandler: Function) {
    socket.on('JOIN_AIQ_IMAGE', exceptionHandler(socket, (): void => {
      socket.join(this._roomId)
      this._logger.writeLog(LOG_BASE.SERVER005, {id: socket.id, roomId: this._roomId})
      this._emitter.updateAiqImageList(this._imageDatabase.getImageList(), socket.id)
      this._emitter.updateAiqChoices(this._imageDatabase.getChoices(), socket.id)
    }))

    socket.on('GET_AIQ_IMAGE_LIST', exceptionHandler(socket, (): void => {
      this._logger.writeLog(LOG_BASE.LIST004, {id: socket.id})
      this._emitter.updateAiqImageList(this._imageDatabase.getImageList(), socket.id)
    }))

    socket.on('ADD_AIQ_GAME_IMAGE', exceptionHandler(socket, (image: IAiqImage): void => {
      this._logger.writeLog(
        LOG_BASE.LIST005,
        Object.assign({}, {id: socket.id, operation: 'add'}, image)
      )
      this._imageDatabase.addImage(image)
      this._imageDatabase.loadSecondaryData()
      this._emitter.updateAiqImageList(this._imageDatabase.getImageList(), this._roomId)
      this._emitter.updateAiqChoices(this._imageDatabase.getChoices())
      this._emitter.systemNotification('success', `${image.anime[0]}: ${image.name} added`, socket.id)
    }))

    socket.on('EDIT_AIQ_GAME_IMAGE', exceptionHandler(socket, (image: IAiqImage): void => {
      this._logger.writeLog(
        LOG_BASE.LIST005,
        Object.assign({}, {id: socket.id, operation: 'edit'}, image)
      )
      this._imageDatabase.editImage(image)
      this._imageDatabase.loadSecondaryData()
      this._emitter.updateAiqImageList(this._imageDatabase.getImageList(), this._roomId)
      this._emitter.updateAiqChoices(this._imageDatabase.getChoices())
      this._emitter.systemNotification('success', `${image.anime[0]}: ${image.name} edited`, socket.id)
    }))

    socket.on('DELETE_AIQ_GAME_IMAGE', exceptionHandler(socket, (image: IAiqImage): void => {
      this._logger.writeLog(
        LOG_BASE.LIST005,
        Object.assign({}, {id: socket.id, operation: 'delete'}, image)
      )
      this._imageDatabase.deleteImage(image)
      this._imageDatabase.loadSecondaryData()
      this._emitter.updateAiqImageList(this._imageDatabase.getImageList(), this._roomId)
      this._emitter.updateAiqChoices(this._imageDatabase.getChoices())
      this._emitter.systemNotification('success', `${image.anime[0]}: ${image.name} deleted`, socket.id)
    }))
  }
}

export {AiqImageListHandler}
