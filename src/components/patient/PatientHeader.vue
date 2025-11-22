<script setup>
import { computed } from 'vue'
import { getInitials, formatAge } from '@/utils/formatters'

const props = defineProps({
  patient: {
    type: Object,
    required: true,
  },
  stats: {
    type: Object,
    default: () => ({
      totalTreatments: 0,
      completedTreatments: 0,
      plannedTreatments: 0,
    }),
  },
})

const avatarInitials = computed(() => {
  return props.patient.avatar || getInitials(props.patient.name)
})
</script>

<template>
  <div class="dental-card p-6">
    <div class="flex items-start gap-4">
      <!-- Patient Avatar -->
      <div class="flex-shrink-0">
        <div
          class="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold"
        >
          {{ avatarInitials }}
        </div>
      </div>

      <!-- Patient Info -->
      <div class="flex-1 min-w-0">
        <h1 class="text-2xl font-bold text-gray-900">
          {{ patient.name }}
        </h1>
        <div class="mt-1 flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div class="flex items-center gap-1">
            <span class="font-medium">ID:</span>
            <span>{{ patient.id }}</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="font-medium">Нас:</span>
            <span>{{ patient.age }} нас</span>
          </div>
          <div v-if="patient.phone" class="flex items-center gap-1">
            <span class="font-medium">Утас:</span>
            <span>{{ patient.phone }}</span>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="flex-shrink-0 flex gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">
            {{ stats.totalTreatments }}
          </div>
          <div class="text-xs text-gray-600">Нийт</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">
            {{ stats.completedTreatments }}
          </div>
          <div class="text-xs text-gray-600">Хийгдсэн</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-amber-600">
            {{ stats.plannedTreatments }}
          </div>
          <div class="text-xs text-gray-600">Төлөвлөсөн</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional styles if needed */
</style>
