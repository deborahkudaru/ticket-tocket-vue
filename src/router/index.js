import { createRouter, createWebHistory } from 'vue-router'

import Layout from '../layout/Layout.vue'
import DashboardLayout from '../layout/DashboardLayout.vue'

import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'
import DashboardView from '../views/DashboardView.vue'
import TicketView from '../views/TicketView.vue'

import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '', component: HomeView },
      { path: 'auth/login', component: LoginView },
      { path: 'auth/signup', component: SignupView },
    ],
  },
  {
    path: '/',
    component: DashboardLayout,
    meta: { requiresAuth: true }, 
    children: [
      { path: 'dashboard', component: DashboardView },
      { path: 'tickets', component: TicketView },
    ],
  },
  { path: '/:pathMatch(.*)*', component: { template: '<div>404 - Page not found</div>' } },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  const session = JSON.parse(localStorage.getItem('ticketapp_session'))

  if (to.meta.requiresAuth) {
    if (!session || session.exp <= Date.now()) {
      localStorage.removeItem('ticketapp_session')
      auth.session = null
      next('/auth/login?m=session_expired')
      return
    }
  }

  next()
})
