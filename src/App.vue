<script setup>
import { RouterView } from 'vue-router';
import Toastification from '@/components/Toastification.vue';
</script>

<template>
  <div>
    <RouterView />
    <Toastification />
  </div>
</template>