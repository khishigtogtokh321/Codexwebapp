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
  <div class="section-card section-card--dense">
    <div class="flex items-start justify-between gap-3">
      <div class="space-y-1">
        <p class="text-base font-semibold text-gray-900 md:text-lg">{{ title }}</p>
        <p class="text-xs uppercase tracking-wide text-gray-500">Төрөл</p>
        <p class="text-sm font-semibold text-gray-900">{{ type }}</p>
      </div>
      <div class="flex flex-col items-end gap-2">
        <span class="pill pill--soft text-xs">{{ count }}</span>
        <span class="pill pill--muted text-xs">{{ date }}</span>
      </div>
    </div>
    <div class="summary-block">
      <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Сүүлд</p>
      <p class="text-sm font-semibold text-gray-900">{{ date }}</p>
    </div>
  </div>
</template>
