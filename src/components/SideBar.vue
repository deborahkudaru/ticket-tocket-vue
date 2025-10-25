<script setup>
import { useRoute, RouterLink } from 'vue-router'

defineProps({
  isOpen: Boolean,
  onClose: Function
})

const route = useRoute()
</script>


<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 z-40 lg:hidden"
    @click="onClose"
  ></div>

  <aside
    class="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-sm border-r border-gray-200
           transform transition-transform duration-300 ease-in-out"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
  >
    <div class="p-6 flex items-center justify-between">
      <RouterLink to="/dashboard" class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-sm">TT</span>
        </div>
        <span class="text-xl font-bold text-gray-900">Ticket Tocket</span>
      </RouterLink>

      <button
        @click="onClose"
        class="lg:hidden text-gray-500 hover:text-gray-700"
        aria-label="Close sidebar"
      >
        <i class="pi pi-times text-xl"></i>
      </button>
    </div>

    <nav class="px-3">
      <ul class="space-y-1">
        <li>
          <RouterLink
            to="/dashboard"
            class="flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200"
            :class="{
              'bg-slate-600 text-white shadow-sm': route.path === '/dashboard',
              'text-gray-700 hover:bg-gray-100 hover:text-gray-900': route.path !== '/dashboard'
            }"
            @click="onClose"
          >
            <i class="pi pi-chart-bar text-lg mr-3"></i>
            Dashboard
          </RouterLink>
        </li>

        <li>
          <RouterLink
            to="/tickets"
            class="flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200"
            :class="{
              'bg-slate-600 text-white shadow-sm': route.path === '/tickets',
              'text-gray-700 hover:bg-gray-100 hover:text-gray-900': route.path !== '/tickets'
            }"
            @click="onClose"
          >
            <i class="pi pi-ticket text-lg mr-3"></i>
            Tickets
          </RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

