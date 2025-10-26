<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '../stores/auth'

defineProps({
  onMenuClick: Function
})

const router = useRouter()
const toast = useToast()
const auth = useAuthStore()

const userName = computed(() => auth.session?.user?.username || auth.session?.user?.name || 'User')
const userEmail = computed(() => auth.session?.user?.email || 'Welcome back!')
const userInitial = computed(() =>
  userName.value?.charAt(0)?.toUpperCase() || 'U'
)

const handleLogout = async () => {
  await auth.logout()
  router.push('/')
  toast.success('Logged out successfully')
}
</script>

<template>
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="flex items-center justify-between h-16 px-4 sm:px-6">
      <button
        @click="onMenuClick"
        class="lg:hidden text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Open menu"
      >
        <i class="pi pi-bars text-xl"></i>
      </button>

      <div class="hidden lg:block"></div>

      <div class="flex items-center space-x-3 sm:space-x-4">
        <div class="flex items-center space-x-2 sm:space-x-3">
          <div class="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
            {{ userInitial }}
          </div>
          <div class="hidden sm:block">
            <div class="text-sm font-medium text-gray-900">{{ userName }}</div>
            <div class="text-xs text-gray-500">{{ userEmail }}</div>
          </div>
        </div>

        <button
          @click="handleLogout"
          class="bg-slate-600 hover:bg-slate-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <i class="pi pi-sign-out text-sm"></i>
          <span class="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  </nav>
</template>
