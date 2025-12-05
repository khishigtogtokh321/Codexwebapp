<script setup>
import { computed } from 'vue'

const props = defineProps({
  plans: {
    type: Array,
    default: () => [
      { id: 1, date: '2025-11-23', name: 'Сувгийн эмчилгээ (CoSe)', status: 'saved', doctor: 'Др. Ану' },
      { id: 2, date: '2025-11-28', name: 'Шүд авах (38)', status: 'saved', doctor: 'Др. Төрболд' },
    ],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  showActions: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['add', 'save', 'row-click'])

const statusPillClass = computed(
  () =>
    'inline-flex items-center rounded-full bg-amber-50 border border-amber-100 px-3 py-1 text-xs font-semibold text-amber-700',
)

const statusLabel = (status) => {
  if (status === 'saved') return 'Хадгалсан'
  if (status === 'draft') return 'Ноорог'
  return status || ''
}

function handleRowClick(plan) {
  emit('row-click', plan)
}
</script>

<template>
  <div class="space-y-4 rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h2 class="text-xl font-semibold text-gray-900">Төлөвлөгөө</h2>
      <div v-if="showActions" class="flex items-center gap-2">
        <button
          type="button"
          class="inline-flex items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
          @click="$emit('add')"
        >
          <span class="text-base leading-none">+</span>
          Нэмэх
        </button>
        <button
          type="button"
          class="inline-flex items-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
          @click="$emit('save')"
        >
          Хадгалах
        </button>
      </div>
    </div>

    <div class="overflow-hidden rounded-xl border border-gray-200">
      <table class="min-w-full divide-y divide-gray-200 text-sm">
        <thead class="bg-gray-50 text-gray-600">
          <tr>
            <th class="px-4 py-3 text-left font-semibold">Огноо</th>
            <th class="px-4 py-3 text-left font-semibold">Эмчилгээний нэр</th>
            <th class="px-4 py-3 text-left font-semibold">Төлөв</th>
            <th class="px-4 py-3 text-left font-semibold">Эмч</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 text-gray-900">
          <tr v-if="loading">
            <td colspan="4" class="px-4 py-6 text-center text-gray-500">Уншиж байна...</td>
          </tr>
          <tr v-else-if="plans.length === 0">
            <td colspan="4" class="px-4 py-6 text-center text-gray-500">Төлөвлөгөө хоосон байна</td>
          </tr>
          <tr
            v-else
            v-for="plan in plans"
            :key="plan.id || plan.name"
            class="cursor-pointer hover:bg-gray-50"
            @click="handleRowClick(plan)"
          >
            <td class="whitespace-nowrap px-4 py-3 font-medium text-gray-900">{{ plan.date }}</td>
            <td class="px-4 py-3 font-medium text-gray-900">{{ plan.name }}</td>
            <td class="px-4 py-3">
              <span :class="statusPillClass">{{ statusLabel(plan.status) }}</span>
            </td>
            <td class="whitespace-nowrap px-4 py-3 font-medium text-gray-900">{{ plan.doctor }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
