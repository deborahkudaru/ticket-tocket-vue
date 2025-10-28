<script setup>
import { ref, onMounted } from 'vue'
import { TicketAPI } from '../service/api'
import StatusBadge from '../components/StatusBadge.vue'
import TicketForm from '../components/TicketForm.vue'
import { useToast } from 'vue-toastification'

const tickets = ref([])
const loading = ref(true)
const editing = ref(null)
const showForm = ref(false)
const deleteModal = ref({ show: false, ticket: null })
const toast = useToast()

// Load all tickets
const load = async () => {
  loading.value = true
  try {
    const list = await TicketAPI.list()
    tickets.value = list
  } catch (e) {
    const errorMsg = e.message || 'Failed to load tickets. Please retry.'
    toast.error(errorMsg)
  } finally {
    loading.value = false
  }
}

onMounted(load)

// Create ticket
const onCreate = async (data) => {
  try {
    await TicketAPI.create(data)
    await load()
    showForm.value = false
    toast.success('Ticket created successfully!')
  } catch (e) {
    toast.error(e.message || 'Failed to save ticket. Please retry.')
  }
}

// Update ticket
const onUpdate = async (id, patch) => {
  try {
    await TicketAPI.update(id, patch)
    await load()
    editing.value = null
    toast.success('Ticket updated successfully!')
  } catch (e) {
    toast.error(e.message || 'Failed to save ticket. Please retry.')
  }
}

// Delete ticket
const onDelete = async (id) => {
  try {
    await TicketAPI.remove(id)
    await load()
    deleteModal.value = { show: false, ticket: null }
    toast.success('Ticket deleted successfully!')
  } catch (e) {
    toast.error(e.message || 'Failed to delete ticket. Please retry.')
  }
}

// Helper + UI functions
const startEditing = (ticket) => {
  editing.value = ticket
  showForm.value = false
}

const cancelEditing = () => {
  editing.value = null
}

const toggleForm = () => {
  showForm.value = !showForm.value
  editing.value = null
}

const openDeleteModal = (ticket) => {
  deleteModal.value = { show: true, ticket }
}

const closeDeleteModal = () => {
  deleteModal.value = { show: false, ticket: null }
}

const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.slice(0, length) + '...' : text
}
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-8 min-h-screen">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Tickets</h1>
      </div>
      <button
        @click="toggleForm"
        class="bg-slate-600 hover:bg-slate-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base whitespace-nowrap"
      >
        {{ showForm ? '✕ Close' : '+ Create Ticket' }}
      </button>
    </div>

    <!-- Create Ticket Form -->
    <div
      v-if="showForm"
      class="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 mb-4 sm:mb-6"
    >
      <h2 class="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
        Create New Ticket
      </h2>
      <TicketForm @submit="onCreate" />
    </div>

    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-slate-600"></div>
    </div>

    <div v-else class="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="t in tickets"
        :key="t.id"
        class="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-start mb-3 sm:mb-4 gap-2">
          <h3 class="font-semibold text-gray-900 text-base sm:text-lg pr-2 wrap-break-word">
            {{ t.title }}
          </h3>
          <StatusBadge :status="t.status" />
        </div>

        <p class="text-gray-600 text-sm mb-3 sm:mb-4 leading-relaxed wrap-break-word">
          {{ truncateText(t.description, 60) }}
        </p>

        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-3 sm:pt-4 border-t border-gray-100 gap-3 sm:gap-0">
          <div class="flex space-x-3">
            <button
              @click="startEditing(t)"
              class="text-slate-600 hover:text-slate-800 font-medium text-sm transition-colors"
            >
              Edit
            </button>
            <button
              @click="openDeleteModal(t)"
              class="text-red-600 hover:text-red-800 font-medium text-sm transition-colors"
            >
              Delete
            </button>
          </div>
          <div class="text-xs text-gray-500">ID: {{ t.id }}</div>
        </div>

        <div
          v-if="editing && editing.id === t.id"
          class="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200"
        >
          <h4 class="font-medium text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
            Edit Ticket
          </h4>
          <TicketForm
            :initial="editing"
            @submit="(data) => onUpdate(t.id, data)"
            @cancel="cancelEditing"
          />
        </div>
      </div>
    </div>

    <div
      v-if="!loading && tickets.length === 0 && !showForm"
      class="text-center py-12"
    >
      <div class="text-5xl sm:text-6xl mb-4">🎫</div>
      <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
        No tickets found
      </h3>
      <p class="text-sm sm:text-base text-gray-600 mb-6 px-4">
        Get started by creating your first ticket
      </p>
      <button
        @click="showForm = true"
        class="bg-slate-600 hover:bg-slate-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
      >
        Create Your First Ticket
      </button>
    </div>

    <div
      v-if="deleteModal.show"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-xl shadow-lg max-w-md w-full p-5 sm:p-6 mx-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900">
            Confirm Deletion
          </h3>
          <button
            @click="closeDeleteModal"
            class="text-gray-400 hover:text-gray-600 transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        <p class="text-sm sm:text-base text-gray-600 mb-6">
          Are you sure you want to delete the ticket
          "<span class="font-semibold wrap-break-word">
            {{ deleteModal.ticket?.title }}
          </span>"
          ? This action cannot be undone.
        </p>

        <div class="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <button
            @click="closeDeleteModal"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            @click="onDelete(deleteModal.ticket.id)"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
          >
            Delete Ticket
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


