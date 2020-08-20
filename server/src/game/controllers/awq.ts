import {AbstractGameController} from './abstract'
import {IAwqRoom} from '../../interfaces'

class AwqGameController extends AbstractGameController {
  protected _rooms: {[key: string]: IAwqRoom}
}


export {AwqGameController}
