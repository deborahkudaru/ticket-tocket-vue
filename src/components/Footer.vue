<script setup>
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-white border-t border-gray-200 py-4">
    <div class="max-w-7xl mx-auto px-4 text-center">
      <p class="text-gray-600 text-sm">
        © {{ currentYear }} Ticket Tocket. All rights reserved.
      </p>
    </div>
  </footer>
</template>

