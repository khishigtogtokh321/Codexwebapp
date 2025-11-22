<script setup>
import { computed } from 'vue'
import { formatDate } from '@/utils/formatters'

const props = defineProps({
  treatments: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['edit', 'delete'])

function getStatusClass(status) {
  return status === 'done'
    ? 'bg-green-100 text-green-800'
    : 'bg-amber-100 text-amber-800'
}

function getStatusLabel(status) {
  return status === 'done' ? 'Хийгдсэн' : 'Төлөвлөсөн'
}

function handleEdit(treatmentId) {
  emit('edit', treatmentId)
}

function handleDelete(treatmentId) {
  emit('delete', treatmentId)
}
</script>

<template>
  <div class="dental-card overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Огноо
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Шүд
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Гадаргуу
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Оношлогоо
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Эмчилгээ
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Эмч
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Үнэ
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Төлөв
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Үйлдэл
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <!-- Loading State -->
          <tr v-if="loading">
            <td colspan="9" class="px-4 py-8 text-center text-gray-500">
              <div class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Ачааллаж байна...</span>
              </div>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-else-if="treatments.length === 0">
            <td colspan="9" class="px-4 py-8 text-center text-gray-500">
              Эмчилгээний түүх олдсонгүй
            </td>
          </tr>

          <!-- Treatment Rows -->
          <tr
            v-for="(treatment, index) in treatments"
            :key="treatment.id"
            :class="[
              'transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md hover:scale-[1.01] cursor-pointer',
              index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
            ]"
          >
            <td class="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
              {{ formatDate(treatment.date) }}
            </td>
            <td class="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
              {{ treatment.tooth }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
              {{ treatment.surface }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-700">
              <div class="max-w-xs truncate" :title="treatment.diagnosis">
                {{ treatment.diagnosis }}
              </div>
            </td>
            <td class="px-4 py-3 text-sm text-gray-700">
              {{ treatment.treatmentType }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
              {{ treatment.doctor }}
            </td>
            <td class="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
              {{ treatment.price }}
            </td>
            <td class="px-4 py-3 text-sm whitespace-nowrap">
              <span
                :class="getStatusClass(treatment.status)"
                class="px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm"
              >
                {{ getStatusLabel(treatment.status) }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm whitespace-nowrap">
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 rounded-lg transition-all duration-200 hover:shadow-md transform hover:scale-105"
                  @click.stop="handleEdit(treatment.id)"
                  title="Засах"
                >
                  Засах
                </button>
                <button
                  type="button"
                  class="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-white bg-red-50 hover:bg-red-600 rounded-lg transition-all duration-200 hover:shadow-md transform hover:scale-105"
                  @click.stop="handleDelete(treatment.id)"
                  title="Устгах"
                >
                  Устгах
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Table Footer with Summary -->
    <div v-if="treatments.length > 0" class="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
      <div class="flex justify-between items-center">
        <span>Total: {{ treatments.length }} treatment(s)</span>
        <span class="font-medium">
          Completed: {{ treatments.filter((t) => t.status === 'done').length }} |
          Planned: {{ treatments.filter((t) => t.status === 'planned').length }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional styles if needed */
</style>
