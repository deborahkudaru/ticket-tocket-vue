<script setup>
import { provide } from 'vue'
import { useAuthProvider } from '../composables/useAuth.js'

const auth = useAuthProvider()
provide('auth', auth)
</script>

<template>
  <slot />
</template>
