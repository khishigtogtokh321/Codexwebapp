<script setup>
const props = defineProps({
  selectedStatus: {
    type: String,
    default: 'planned',
    validator: (value) => ['planned', 'done'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['change'])

const statuses = [
  { id: 'planned', label: 'Төлөвлөсөн', color: 'amber' },
  { id: 'done', label: 'Хийгдсэн', color: 'green' },
]

function handleChange(statusId) {
  if (!props.disabled) {
    emit('change', statusId)
  }
}

function isSelected(statusId) {
  return props.selectedStatus === statusId
}
</script>

<template>
  <div class="space-y-3 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
    <label class="block text-sm font-semibold text-gray-800 flex items-center gap-2">
      <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      Төлөв
    </label>
    <div class="flex gap-2">
      <button
        v-for="status in statuses"
        :key="status.id"
        type="button"
        :disabled="disabled"
        :class="[
          'flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg border-2 transition-all duration-300 transform hover:scale-105',
          isSelected(status.id) && status.color === 'amber'
            ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-500 shadow-lg shadow-amber-200'
            : '',
          isSelected(status.id) && status.color === 'green'
            ? 'bg-gradient-to-r from-green-600 to-green-700 text-white border-green-600 shadow-lg shadow-green-200'
            : '',
          !isSelected(status.id)
            ? 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md'
            : '',
          disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : 'cursor-pointer',
        ]"
        @click="handleChange(status.id)"
      >
        {{ status.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Additional styles if needed */
</style>
