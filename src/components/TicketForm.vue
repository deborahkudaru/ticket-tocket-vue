<script setup>
import { reactive } from 'vue'

// Props
const props = defineProps({
  initial: {
    type: Object,
    default: () => ({}),
  },
  onSubmit: Function,
  onCancel: Function,
})

// State
const values = reactive({
  title: props.initial.title || '',
  description: props.initial.description || '',
  status: props.initial.status || 'open',
})

const errors = reactive({})

// Validation
const validate = (v) => {
  const e = {}
  if (!v.title || v.title.trim().length < 3)
    e.title = 'Title must be at least 3 characters'
  const allowed = ['open', 'in_progress', 'closed']
  if (!v.status || !allowed.includes(v.status))
    e.status = 'Status must be one of: open, in_progress, closed'
  if (v.description && v.description.length > 2000)
    e.description = 'Description too long'
  return e
}

// Submit
const submit = () => {
  const errs = validate(values)
  Object.keys(errors).forEach((k) => delete errors[k])
  Object.assign(errors, errs)

  if (Object.keys(errors).length) return
  props.onSubmit?.(values)
}
</script>


<template>
  <form @submit.prevent="submit" class="space-y-4 sm:space-y-6">
    <!-- Title -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
        Title <span class="text-red-500">*</span>
      </label>
      <input
        v-model="values.title"
        class="w-full border rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-colors"
        :class="errors.title ? 'border-red-300' : 'border-gray-300'"
        placeholder="Enter ticket title"
      />
      <div v-if="errors.title" class="text-red-600 text-xs sm:text-sm mt-1.5 sm:mt-2 flex items-center">
        <span class="mr-1">⚠</span>
        {{ errors.title }}
      </div>
    </div>

    <!-- Status -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
        Status <span class="text-red-500">*</span>
      </label>
      <select
        v-model="values.status"
        class="w-full border rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-colors"
        :class="errors.status ? 'border-red-300' : 'border-gray-300'"
      >
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="closed">Closed</option>
      </select>
      <div v-if="errors.status" class="text-red-600 text-xs sm:text-sm mt-1.5 sm:mt-2 flex items-center">
        <span class="mr-1">⚠</span>
        {{ errors.status }}
      </div>
    </div>

    <!-- Description -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
        Description
        <span class="text-gray-500 text-xs font-normal ml-2">{{ values.description.length }}/2000</span>
      </label>
      <textarea
        v-model="values.description"
        rows="4"
        placeholder="Describe the issue or request..."
        class="w-full border rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-colors resize-none"
        :class="errors.description ? 'border-red-300' : 'border-gray-300'"
      ></textarea>
      <div v-if="errors.description" class="text-red-600 text-xs sm:text-sm mt-1.5 sm:mt-2 flex items-center">
        <span class="mr-1">⚠</span>
        {{ errors.description }}
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
      <button
        v-if="onCancel"
        type="button"
        @click="onCancel"
        class="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex-1 text-sm sm:text-base"
      >
        Cancel
      </button>

      <button
        type="submit"
        class="bg-slate-600 hover:bg-slate-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-colors duration-200 flex-1 text-sm sm:text-base"
      >
        {{ initial.id ? 'Update Ticket' : 'Create Ticket' }}
      </button>
    </div>
  </form>
</template>

