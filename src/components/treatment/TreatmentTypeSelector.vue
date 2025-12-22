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
    filtered = filtered.filter((t) => t.id.toLowerCase().includes(q) || t.label.toLowerCase().includes(q))
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
    <div class="flex items-center justify-between">
      <!-- <label class="text-sm font-semibold text-gray-900 flex items-center gap-2">
       3. Эмчилгээ сонгох
      </label> -->
      
    </div>

    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Эмчилгээ хайх..."
        class="input-field h-9 pl-8 text-sm"
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

    <select v-model="selectedCategory" class="input-field h-9 text-sm" :disabled="disabled">
      <option value="all">Бүх ангилал</option>
      <option
        v-for="category in treatmentCategories"
        :key="category.id"
        :value="category.id"
      >
        {{ category.label }}
      </option>
    </select>

    <div
      class="h-[200px] overflow-y-auto border border-gray-200 rounded-lg bg-white scrollbar-thin"
      :class="disabled ? 'opacity-60 pointer-events-none' : ''"
    >
      <div v-if="filteredTreatmentTypes.length === 0" class="p-3 text-center text-gray-500 text-sm">
        Илэрцгүй
      </div>
      <button
        v-for="type in filteredTreatmentTypes"
        :key="type.id"
        type="button"
        :disabled="disabled"
        :class="[
          'w-full text-left px-3 py-3 min-h-[44px] text-sm border-b border-gray-100 last:border-b-0 transition-all duration-150',
          isSelected(type.id)
            ? 'bg-blue-600 text-white font-semibold shadow-sm'
            : 'hover:bg-blue-50 text-gray-800',
          disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
        ]"
        @click="handleSelect(type.id)"
      >
        {{ getTreatmentLabel(type) }}
      </button>
    </div>

    <!-- <p v-if="selectedTypes.length" class="text-xs text-blue-700 font-medium flex items-center gap-1">
      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
      </svg>
      Сонгосон:
      {{
        selectedTypes
          .map((id) => (props.treatments?.find((t) => t.id === id) || treatmentTypes.find((t) => t.id === id))?.label || id)
          .join(', ')
      }}
    </p> -->

</template>

<style scoped>
/* Additional styles if needed */
</style>
