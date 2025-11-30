<script setup>
const props = defineProps({
  title: {
    type: String,
    default: 'Дахин дуудаx',
  },
  count: {
    type: [Number, String],
    default: 2,
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
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-5 space-y-4">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-xl font-semibold text-gray-900">{{ title }}</p>
        <p class="text-sm text-gray-600 mt-1">Бүлэг</p>
        <p class="text-sm font-semibold text-gray-900">{{ type }}</p>
      </div>
      <div class="flex flex-col items-end gap-3">
        <span
          class="inline-flex items-center rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 border border-blue-200"
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
  </div>
</template>
