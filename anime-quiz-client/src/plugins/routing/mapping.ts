import { Component } from 'vue/types/options'
import { DIALOG_ROUTES, ROUTES } from './routes'
import { store } from '../store'
import Login from '../../views/Login.vue'
import LoginSettings from '../../components/login/LoginSettings.vue'
import LoginPanel from '../../components/login/LoginPanel.vue'
import Lobby from '../../views/Lobby.vue'
import SongListPanel from '../../components/song-list/SongListPanel.vue'
import SongList from '../../views/SongList.vue'
import RoomList from '../../views/RoomList.vue'
import RoomListPanel from '../../components/room-list/RoomListPanel.vue'
import GameRoom from '../../views/GameRoom.vue'
import GameRoomPanel from '../../components/game-room/GameRoomPanel.vue'
import RoomListNewRoom from '../../components/room-list/RoomListNewRoom.vue'
import GameRoomSettings from '../../components/game-room/GameRoomSettings.vue'
import DefaultPanel from '../../components/app/DefaultPanel.vue'
import AnimeListEdit from '../../views/AnimeListEdit.vue'
import AnimeListEditPanel from '../../components/anime-list-edit/AnimeListEditPanel.vue'
import EditAnimeDialog from '../../components/anime-list-edit/EditAnimeDialog.vue'
import DeleteAnimeDialog from '../../components/anime-list-edit/DeleteAnimeDialog.vue'

const _PANEL_MAPPING: { [key: string]: Component } = {
  [ROUTES.LOGIN]: LoginPanel,
  [ROUTES.SONG_LIST]: SongListPanel,
  [ROUTES.ROOM_LIST]: RoomListPanel,
  [ROUTES.GAME_ROOM]: GameRoomPanel,
  [ROUTES.ANIME_LIST_EDIT]: AnimeListEditPanel
}

const _VIEW_MAPPING: { [key: string]: Component } = {
  [ROUTES.LOGIN]: Login,
  [ROUTES.LOBBY]: Lobby,
  [ROUTES.SONG_LIST]: SongList,
  [ROUTES.ROOM_LIST]: RoomList,
  [ROUTES.GAME_ROOM]: GameRoom,
  [ROUTES.ANIME_LIST_EDIT]: AnimeListEdit
}

const _DIALOG_MAPPING: { [key: string]: Component } = {
  [DIALOG_ROUTES.LOGIN_SETTINGS]: LoginSettings,
  [DIALOG_ROUTES.NEW_ROOM]: RoomListNewRoom,
  [DIALOG_ROUTES.GAME_ROOM_SETTINGS]: GameRoomSettings,
  [DIALOG_ROUTES.NEW_ANIME_DIALOG]: EditAnimeDialog,
  [DIALOG_ROUTES.EDIT_ANIME_DIALOG]: EditAnimeDialog,
  [DIALOG_ROUTES.DELETE_ANIME_DIALOG]: DeleteAnimeDialog
}

function viewComponent(): any {
  return _VIEW_MAPPING[store.state.client.view]
}

function panelComponent(): any {
  return _PANEL_MAPPING[store.state.client.view] || DefaultPanel
}

function dialogComponent(): any {
  return _DIALOG_MAPPING[store.state.client.dialogView]
}

export {
  viewComponent,
  panelComponent,
  dialogComponent
}
