<script setup>
import { TOOTH_SURFACES } from '@/utils/toothHelpers'

const props = defineProps({
  selectedSurfaces: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle'])

const surfaces = [
  { id: 'M', label: 'M - Mesial', name: TOOTH_SURFACES.M },
  { id: 'O', label: 'O - Occlusal', name: TOOTH_SURFACES.O },
  { id: 'D', label: 'D - Distal', name: TOOTH_SURFACES.D },
  { id: 'B', label: 'B - Buccal', name: TOOTH_SURFACES.B },
  { id: 'L', label: 'L - Lingual', name: TOOTH_SURFACES.L },
]

function isSelected(surfaceId) {
  return props.selectedSurfaces.includes(surfaceId)
}

function handleToggle(surfaceId) {
  if (!props.disabled) {
    emit('toggle', surfaceId)
  }
}
</script>

<template>
  <div class="space-y-3 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
    <label class="block text-sm font-semibold text-gray-800 flex items-center gap-2">
      <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      Шүдний гадаргуу
    </label>
    <div class="grid grid-cols-2 gap-2">
      <button
        v-for="surface in surfaces"
        :key="surface.id"
        type="button"
        :disabled="disabled"
        :class="[
          'px-3 py-2.5 text-sm font-semibold rounded-lg border-2 transition-all duration-300 transform hover:scale-105',
          isSelected(surface.id)
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-600 shadow-lg shadow-blue-200'
            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md',
          disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : 'cursor-pointer',
        ]"
        @click="handleToggle(surface.id)"
      >
        {{ surface.label }}
      </button>
    </div>
    <p v-if="selectedSurfaces.length > 0" class="text-xs text-blue-600 font-medium mt-2 flex items-center gap-1">
      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
      </svg>
      Сонгосон: {{ selectedSurfaces.join(', ') }}
    </p>
  </div>
</template>

<style scoped>
/* Additional styles if needed */
</style>
