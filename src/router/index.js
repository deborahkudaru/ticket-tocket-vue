import { createRouter, createWebHistory } from 'vue-router';

import Layout from '../layout/Layout.vue';
import DashboardLayout from '../layout/DashboardLayout.vue';

import Home from '../pages/Home.vue';
import Login from '../pages/auth/Login.vue';
import Signup from '../pages/auth/Signup.vue';
import Dashboard from '../pages/Dashboard.vue';
import TicketList from '../pages/TicketList.vue';

import { useAuthStore } from '../stores/auth';

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '', component: Home },
      { path: 'auth/login', component: Login },
      { path: 'auth/signup', component: Signup },
    ],
  },
  {
    path: '/',
    beforeEnter: (to, from, next) => {
      const auth = useAuthStore();
      if (!auth.session) {
        next('/auth/login?m=session_expired');
      } else {
        next();
      }
    },
    component: DashboardLayout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'tickets', component: TicketList },
    ],
  },
  { path: '/:pathMatch(.*)*', component: { template: '<div>404</div>' } },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
