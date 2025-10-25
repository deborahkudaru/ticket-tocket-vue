<script setup>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-gray-800 flex flex-col container">
    <Navbar />
    <main class="flex-1 py-8">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>


