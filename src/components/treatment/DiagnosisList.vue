<script setup>
import { ref, computed } from 'vue'
import { diagnoses } from '@/data'

const props = defineProps({
  selectedDiagnoses: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle'])

const searchQuery = ref('')

const filteredDiagnoses = computed(() => {
  if (!searchQuery.value) return diagnoses

  const query = searchQuery.value.toLowerCase()
  return diagnoses.filter((d) => d.code.toLowerCase().includes(query) || d.name.toLowerCase().includes(query))
})

function isSelected(code) {
  return props.selectedDiagnoses.includes(code)
}

function handleToggle(code) {
  if (!props.disabled) {
    emit('toggle', code)
  }
}
</script>

<template>
  <div class="space-y-1.5">
    <label class="block text-sm font-medium text-gray-700">
      Оношилгоо сонгох
      <span v-if="selectedDiagnoses.length > 0" class="text-blue-600">({{ selectedDiagnoses.length }} сонгогдсон)</span>
    </label>

    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Онош хайх..."
        class="input-field pl-8"
        :disabled="disabled"
      />
      <svg
        class="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400"
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

    <div class="h-[200px] max-h-[220px] overflow-y-auto border border-gray-300 rounded-lg bg-white scrollbar-thin">
      <div v-if="filteredDiagnoses.length === 0" class="p-3 text-center text-gray-500 text-sm">Онош олдсонгүй</div>
      <label
        v-for="diagnosis in filteredDiagnoses"
        :key="diagnosis.code"
        :class="[
          'flex items-start gap-2.5 p-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0',
          isSelected(diagnosis.code) ? 'bg-blue-50' : '',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
        ]"
        @click.prevent="handleToggle(diagnosis.code)"
      >
        <input
          type="checkbox"
          :checked="isSelected(diagnosis.code)"
          :disabled="disabled"
          class="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          @click.stop="handleToggle(diagnosis.code)"
        />
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium text-gray-900">
            {{ diagnosis.code }}
          </div>
          <div class="text-xs text-gray-600 mt-0.5">
            {{ diagnosis.name }}
          </div>
        </div>
      </label>
    </div>

    <p v-if="selectedDiagnoses.length > 0" class="text-xs text-gray-500">Сонгосон онош: {{ selectedDiagnoses.join(', ') }}</p>
  </div>
</template>

<style scoped>
/* Additional styles if needed */
</style>
