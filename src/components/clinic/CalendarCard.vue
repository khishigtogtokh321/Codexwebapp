<script setup>
import { computed } from 'vue'

const props = defineProps({
  monthLabel: {
    type: String,
    default: 'December 2025',
  },
  weekDays: {
    type: Array,
    default: () => ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'],
  },
  days: {
    type: Array,
    default: () => [
      { label: '1' },
      { label: '2' },
      { label: '3' },
      { label: '4' },
      { label: '5' },
      { label: '6' },
      { label: '7' },
      { label: '8' },
      { label: '9' },
      { label: '10' },
      { label: '11' },
      { label: '12' },
      { label: '13' },
      { label: '14' },
      { label: '15' },
      { label: '16' },
      { label: '17' },
      { label: '18' },
      { label: '19' },
      { label: '20' },
      { label: '21' },
      { label: '22' },
      { label: '23' },
      { label: '24' },
      { label: '25' },
      { label: '26' },
      { label: '27' },
      { label: '28' },
      { label: '29' },
      { label: '30' },
      { label: '31' },
      { label: '1', muted: true },
      { label: '2', muted: true },
      { label: '3', muted: true },
      { label: '4', muted: true },
    ],
  },
  selectedDate: {
    type: [String, Number],
    default: '1',
  },
})

const isSelected = (day) => `${day.label}` === `${props.selectedDate}` && !day.muted

const dayClass = computed(
  () =>
    'flex items-center justify-center h-10 w-full rounded-xl transition-colors text-sm font-medium border border-transparent',
)
</script>

<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-5 space-y-4">
    <div class="flex items-center justify-between">
      <p class="text-xl font-semibold text-gray-900">{{ monthLabel }}</p>
      <div class="flex items-center gap-2 text-gray-500">
        <button class="h-9 w-9 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-center">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 18 9 12l6-6" />
          </svg>
        </button>
        <button class="h-9 w-9 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-center">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m9 6 6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-7 text-center text-xs font-semibold text-gray-500">
      <span v-for="day in weekDays" :key="day">{{ day }}</span>
    </div>

    <div class="grid grid-cols-7 gap-2 text-gray-800">
      <span
        v-for="(day, index) in days"
        :key="`${day.label}-${index}`"
        :class="[
          dayClass,
          day.muted ? 'text-gray-300' : 'text-gray-800',
          isSelected(day) ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold' : '',
        ]"
      >
        {{ day.label }}
      </span>
    </div>
  </div>
</template>
