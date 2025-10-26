import { createRouter, createWebHistory } from 'vue-router'

import Layout from '../layout/Layout.vue'
import DashboardLayout from '../layout/DashboardLayout.vue'

import Home from '../pages/Home.vue'
import Login from '../pages/auth/Login.vue'
import Signup from '../pages/auth/Signup.vue'
import Dashboard from '../pages/Dashboard.vue'
import TicketList from '../pages/TicketList.vue'

import { useAuthStore } from '../stores/auth'

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
    component: DashboardLayout,
    meta: { requiresAuth: true }, // ✅ protect everything under this layout
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'tickets', component: TicketList },
    ],
  },
  { path: '/:pathMatch(.*)*', component: { template: '<div>404 - Page not found</div>' } },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ✅ Global Navigation Guard (checks session for protected routes)
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  const session = JSON.parse(localStorage.getItem('ticketapp_session'))

  // if route requires auth and no session or session expired
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
