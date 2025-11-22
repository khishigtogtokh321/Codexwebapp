<script setup>
import { ref, computed } from 'vue'
import { treatmentTypes, treatmentCategories } from '@/data'

const props = defineProps({
  selectedTypes: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  treatments: {
    type: Array,
    default: () => treatmentTypes,
  },
})

const emit = defineEmits(['toggle'])

const selectedCategory = ref('all')
const searchQuery = ref('')

const filteredTreatmentTypes = computed(() => {
  let filtered = props.treatments?.length ? props.treatments : treatmentTypes
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter((t) => t.category === selectedCategory.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (t) => t.id.toLowerCase().includes(q) || t.label.toLowerCase().includes(q)
    )
  }
  return filtered
})

function handleSelect(typeId) {
  if (!props.disabled) emit('toggle', typeId)
}

function getTreatmentLabel(type) {
  return type.label
}

function isSelected(id) {
  return props.selectedTypes.includes(id)
}
</script>

<template>
  <div class="space-y-3 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
    <label class="block text-sm font-semibold text-gray-800 flex items-center gap-2">
      <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
      </svg>
      Эмчилгээний төрөл сонгох
    </label>

    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Эмчилгээ хайх..."
        class="input-field pl-8 transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        :disabled="disabled"
      />
      <svg
        class="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
    </div>

    <select
      v-model="selectedCategory"
      class="input-field text-sm"
      :disabled="disabled"
    >
      <option value="all">Бүх төрөл</option>
      <option
        v-for="category in treatmentCategories"
        :key="category.id"
        :value="category.id"
      >
        {{ category.label }}
      </option>
    </select>

    <div class="h-48 overflow-y-auto border-2 border-gray-200 rounded-lg bg-white scrollbar-thin shadow-inner">
      <div v-if="filteredTreatmentTypes.length === 0" class="p-4 text-center text-gray-500 text-sm">
        <svg class="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Эмчилгээ олдсонгүй
      </div>
      <button
        v-for="type in filteredTreatmentTypes"
        :key="type.id"
        type="button"
        :disabled="disabled"
        :class="[
          'w-full text-left px-4 py-3 text-sm border-b border-gray-100 last:border-b-0 transition-all duration-200 transform hover:scale-[1.02]',
          isSelected(type.id)
            ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold shadow-md'
            : 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 text-gray-700 hover:shadow-sm',
          disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : 'cursor-pointer',
        ]"
        @click="handleSelect(type.id)"
      >
        {{ getTreatmentLabel(type) }}
      </button>
    </div>

    <p v-if="selectedTypes.length" class="text-xs text-purple-600 font-medium flex items-center gap-1">
      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
      </svg>
      Сонгосон: {{ selectedTypes.map((id) => (props.treatments?.find((t) => t.id === id) || treatmentTypes.find((t) => t.id === id))?.label || id).join(', ') }}
    </p>
  </div>
</template>

<style scoped>
/* Additional styles if needed */
</style>
