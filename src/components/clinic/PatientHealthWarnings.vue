<script setup>
const props = defineProps({
  allergies: {
    type: Array,
    default: () => ['Пенициллин', 'Лидокаин'],
  },
  complaints: {
    type: Array,
    default: () => ['Шүд янгинаж өвдөнө', 'Буйл хавдсан'],
  },
  title: {
    type: String,
    default: 'Эрүүл мэндийн анхааруулга',
  },
})
</script>

<template>
  <div class="space-y-4 rounded-2xl border border-red-200 bg-red-50 px-6 py-5 shadow-sm">
    <div class="flex items-center gap-2">
      <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-700">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
          />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-gray-900">{{ title }}</h3>
    </div>

    <div class="space-y-2">
      <p class="text-sm font-semibold text-gray-900">Харшил</p>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="pill in allergies"
          :key="pill"
          class="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-100 px-3 py-1 text-xs font-semibold text-red-700"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
            />
          </svg>
          {{ pill }}
        </span>
      </div>
    </div>

    <div class="space-y-2">
      <p class="text-sm font-semibold text-gray-900">Зовиур / Гомдол</p>
      <div class="space-y-2 text-sm text-gray-800">
        <div v-for="item in complaints" :key="item" class="flex items-start gap-2">
          <span class="mt-1 h-2 w-2 rounded-full bg-gray-400"></span>
          <p class="leading-snug">{{ item }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
