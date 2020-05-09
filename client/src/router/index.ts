import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import Login from '@/views/Login.vue'
import ListPicker from '@/views/ListPicker.vue'
import Game from '@/views/Game.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/list-picker',
    name: 'list-picker',
    component: ListPicker
  },
  {
    path: '/game',
    name: 'game',
    component: Game
  },
  {
    path: '*',
    redirect: '/login'
  }
]

const router = new VueRouter({
  routes
})

export default router
