<script setup>
import { ref } from 'vue'

const props = defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
  statusFilter: {
    type: String,
    default: 'all',
  },
})

const emit = defineEmits(['search', 'filter-status'])

const localSearchQuery = ref(props.searchQuery)
const localStatusFilter = ref(props.statusFilter)

function handleSearch() {
  emit('search', localSearchQuery.value)
}

function handleStatusFilter() {
  emit('filter-status', localStatusFilter.value)
}

// Emit on input with debounce effect
function handleSearchInput() {
  emit('search', localSearchQuery.value)
}

// Clear all filters
function handleClear() {
  localSearchQuery.value = ''
  localStatusFilter.value = 'all'
  handleSearch()
  handleStatusFilter()
}
</script>

<template>
  <div class="flex gap-4 items-center">
    <!-- Search Input -->
    <div class="flex-1 relative">
      <input
        v-model="localSearchQuery"
        type="text"
        placeholder="Шүд, оношлогоо, эмчээр хайх..."
        class="input-field pl-10"
        @input="handleSearchInput"
      />
      <svg
        class="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        ></path>
      </svg>
    </div>

    <!-- Status Filter -->
    <div class="flex-shrink-0">
      <select
        v-model="localStatusFilter"
        class="input-field"
        @change="handleStatusFilter"
      >
        <option value="all">Бүх төлөв</option>
        <option value="done">Хийгдсэн</option>
        <option value="planned">Төлөвлөсөн</option>
      </select>
    </div>

    <!-- Clear Button -->
    <button
      v-if="localSearchQuery || localStatusFilter !== 'all'"
      type="button"
      class="btn-secondary"
      @click="handleClear"
    >
      Цэвэрлэх
    </button>
  </div>
</template>

<style scoped>
/* Additional styles if needed */
</style>
