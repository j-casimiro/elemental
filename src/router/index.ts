import { createRouter, createWebHistory } from 'vue-router';
import MenuPage from '../components/MenuPage.vue';
import MainGame from '../components/MainGame.vue';

const routes = [
  {
    path: '/',
    name: 'Menu',
    component: MenuPage,
  },
  {
    path: '/main-game',
    name: 'MainGame',
    component: MainGame,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
