import { createRouter, createWebHistory } from 'vue-router';
import MenuPage from '../components/MenuPage.vue';
import PeriodicTable from '../components/PeriodicTable.vue';

const routes = [
  {
    path: '/',
    name: 'Menu',
    component: MenuPage,
  },
  {
    path: '/periodic-table',
    name: 'PeriodicTable',
    component: PeriodicTable,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
