import { UserDatabase } from './user'
import { store } from '../../plugins/store'
import { SongDatabase } from './song'

let userDb: UserDatabase
let songDb: SongDatabase

function initDb(): void {
  userDb = new UserDatabase(store.state.userDbPath)
  songDb = new SongDatabase(store.state.songDbPath)
}

export {
  initDb
}
