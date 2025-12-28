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
  <div class="history-search">
    <!-- Search Input -->
    <div class="history-search__input">
      <input
        v-model="localSearchQuery"
        type="text"
        placeholder="Шүд, оношлогоо, эмчээр хайх..."
        class="history-search__field"
        @input="handleSearchInput"
      />
      <svg
        class="history-search__icon"
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
    <div class="history-search__select-wrap">
      <select
        v-model="localStatusFilter"
        class="history-search__select"
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
      class="history-search__clear"
      @click="handleClear"
    >
      Цэвэрлэх
    </button>
  </div>
</template>

<style scoped>
/* Additional styles if needed */
</style>
