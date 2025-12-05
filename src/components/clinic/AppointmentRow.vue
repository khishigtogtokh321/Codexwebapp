<script setup>
import { computed } from 'vue'

const props = defineProps({
  time: {
    type: String,
    default: '14:00',
  },
  name: {
    type: String,
    default: 'Др. Саран',
  },
  subtitle: {
    type: String,
    default: 'Түрүүвэр үзлэг',
  },
  duration: {
    type: String,
    default: '30 мин',
  },
  active: {
    type: Boolean,
    default: false,
  },
  accent: {
    type: String,
    default: 'emerald',
  },
})

const accentClasses = computed(() => {
  if (props.accent === 'emerald') {
    return {
      container: props.active
        ? 'border-emerald-200 bg-emerald-50'
        : 'border-gray-200 bg-gray-50',
      duration: 'border-emerald-200 text-emerald-700',
      dot: props.active ? 'bg-emerald-500' : 'bg-gray-400',
    }
  }
  return {
    container: 'border-gray-200 bg-gray-50',
    duration: 'border-gray-200 text-gray-700',
    dot: 'bg-gray-400',
  }
})
</script>

<template>
  <div
    :class="[
      'flex items-center gap-3 rounded-xl border px-3 py-2.5 transition hover:shadow-sm',
      accentClasses.container,
    ]"
  >
    <div class="w-14 text-sm font-semibold text-gray-900">{{ time }}</div>
    <div class="min-w-0 flex-1">
      <p class="truncate text-sm font-semibold text-gray-900">{{ name }}</p>
      <p class="truncate text-xs text-gray-500">{{ subtitle }}</p>
    </div>
    <div class="flex items-center gap-2">
      <span
        class="rounded-full bg-white px-3 py-1 text-xs font-semibold border"
        :class="accentClasses.duration"
      >
        {{ duration }}
      </span>
      <span class="h-2 w-2 rounded-full" :class="accentClasses.dot"></span>
    </div>
  </div>
</template>
