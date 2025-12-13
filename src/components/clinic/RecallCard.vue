<script setup>
const props = defineProps({
  title: {
    type: String,
    default: 'Дахин дуудлага',
  },
  count: {
    type: [Number, String],
    default: 1,
  },
  type: {
    type: String,
    default: 'Урьдчилан сэргийлэх',
  },
  date: {
    type: String,
    default: '2026-05-28',
  },
})
</script>

<template>
  <div class="space-y-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
    <div class="flex items-start justify-between">
      <div class="space-y-1">
        <p class="text-xl font-semibold text-gray-900">{{ title }}</p>
        <p class="text-sm text-gray-600">Төрөл</p>
        <p class="text-sm font-semibold text-gray-900">{{ type }}</p>
      </div>
      <div class="flex flex-col items-end gap-3">
        <span
          class="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
        >
          {{ count }}
        </span>
        <button
          type="button"
          class="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
        >
          {{ date }}
        </button>
      </div>
    </div>
    <p class="text-sm text-gray-500">Сүүлд: {{ date }}</p>
  </div>
</template>
