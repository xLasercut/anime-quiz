import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router'
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import NotFound from "@/views/NotFound.vue";

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/:pathMatch(.*)', component: NotFound}
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

export {router}
