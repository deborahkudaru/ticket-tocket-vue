<script setup>
import { ref } from 'vue'
import Sidebar from '../components/SideBar.vue'
import DashboardNavbar from '../components/DashboardNavbar.vue'
import Footer from '../components/Footer.vue'

const sidebarOpen = ref(false)
</script>

<template>
  <div class="flex min-h-screen bg-gray-50 container">
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />

    <div class="flex-1 flex flex-col">
      <DashboardNavbar @menu-click="sidebarOpen = true" />
      <main class="p-6 max-w-[1440px] w-full mx-auto">
        <RouterView />
      </main>
      <Footer />
    </div>
  </div>
</template>

