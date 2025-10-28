<script setup>
import { ref, onMounted } from 'vue'
import { TicketAPI } from '../service/api'

const stats = ref({ total: 0, open: 0, resolved: 0 })
const err = ref('')
const loading = ref(true)

const fetchTickets = async () => {
  loading.value = true
  err.value = ''
  try {
    const list = await TicketAPI.list()
    const total = list.length
    const open = list.filter(t => t.status === 'open').length
    const resolved = list.filter(t => t.status === 'closed').length
    stats.value = { total, open, resolved }
  } catch (e) {
    err.value = e.message || 'Failed to load tickets. Please retry.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchTickets)
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-6xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div
        v-if="err"
        class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex justify-between items-center"
      >
        <span>{{ err }}</span>
        <button
          @click="fetchTickets"
          class="text-sm text-slate-600 hover:underline ml-3"
        >
          Retry
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center text-gray-500 py-8">
        Loading dashboard...
      </div>

      <!-- Stats -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div class="text-sm font-medium text-gray-500 mb-2">Total Tickets</div>
          <div class="text-3xl font-bold text-gray-900">{{ stats.total }}</div>
          <div class="text-xs text-gray-400 mt-2">All tickets in the system</div>
        </div>

        <div
          class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div class="text-sm font-medium text-gray-500 mb-2">Open Tickets</div>
          <div class="text-3xl font-bold text-green-600">{{ stats.open }}</div>
          <div class="text-xs text-gray-400 mt-2">Requiring attention</div>
        </div>

        <div
          class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div class="text-sm font-medium text-gray-500 mb-2">Resolved</div>
          <div class="text-3xl font-bold text-blue-600">{{ stats.resolved }}</div>
          <div class="text-xs text-gray-400 mt-2">Completed tickets</div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h2 class="text-xl font-semibold text-gray-900">
              Ticket Management
            </h2>
            <p class="text-gray-600 mt-1">
              View and manage all your support tickets
            </p>
          </div>
          <RouterLink
            to="/tickets"
            class="mt-4 sm:mt-0 inline-flex items-center justify-center bg-slate-600 hover:bg-slate-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200"
          >
            Go to Tickets
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>


