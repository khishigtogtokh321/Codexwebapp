<script setup>
import { computed } from 'vue'

const props = defineProps({
  history: {
    type: Array,
    default: () => [
      {
        id: 1,
        date: '2025-10-20',
        tooth: '36',
        surface: 'MOD',
        code: 'K02.1',
        note: 'Кариес (Гүн)',
        price: '150,000₮',
        discount: '-',
        doctor: 'Др. Төрболд',
      },
      {
        id: 2,
        date: '2025-10-25',
        tooth: '46',
        surface: 'O',
        code: 'K04.0',
        note: 'Пульпит',
        price: '70,000₮',
        discount: '-10,000₮',
        doctor: 'Др. Ану',
      },
    ],
  },
  discountText: {
    type: String,
    default: '-10,000₮',
  },
  totalText: {
    type: String,
    default: '220,000₮',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['open-detail'])

const latestDate = computed(() => {
  if (!props.history?.length) return '—'
  const dates = props.history.map((item) => item.date)
  return dates.sort().slice(-1)[0]
})

const summaryBadges = computed(() => [
  { label: 'Нийт дүн', value: props.totalText },
  { label: 'Хөнгөлөлт', value: props.discountText },
  { label: 'Сүүлийн эмчилгээ', value: latestDate.value },
])
</script>

<template>
  <div class="space-y-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h2 class="text-lg font-semibold text-gray-900">Хийгдсэн эмчилгээ</h2>
      <div class="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-gray-700">
        <span
          v-for="badge in summaryBadges"
          :key="badge.label"
          class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] text-gray-800"
        >
          <span class="text-gray-500">{{ badge.label }}:</span>
          <span class="text-gray-900">{{ badge.value }}</span>
        </span>
      </div>
    </div>

    <div class="rounded-xl border border-gray-200">
      <div class="overflow-x-auto">
        <table class="min-w-[960px] divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50 text-gray-600 text-xs font-semibold uppercase tracking-wide">
            <tr>
            <th class="px-3 py-2 text-left">Огноо</th>
            <th class="px-3 py-2 text-left">Шүд</th>
            <th class="px-3 py-2 text-left">Гадаргуу</th>
            <th class="px-3 py-2 text-left">Код</th>
            <th class="px-3 py-2 text-left">Тайлбар / Онош</th>
            <th class="px-3 py-2 text-right">Үнэ</th>
            <th class="px-3 py-2 text-right">Хөнгөлөлт</th>
            <th class="px-3 py-2 text-left">Эмч</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-gray-900">
            <tr v-if="loading">
            <td colspan="8" class="px-3 py-5 text-center text-gray-500">Уншиж байна...</td>
          </tr>
            <tr v-else-if="history.length === 0">
            <td colspan="8" class="px-3 py-5 text-center text-gray-500">Түүх хоосон байна</td>
          </tr>
            <tr
              v-else
              v-for="(item, index) in history"
              :key="item.id || item.date + item.tooth"
              class="hover:bg-gray-50 cursor-pointer"
              @dblclick="emit('open-detail', { item, index })"
            >
            <td class="whitespace-nowrap px-3 py-2.5 font-medium text-gray-900">{{ item.date }}</td>
            <td class="whitespace-nowrap px-3 py-2.5 font-medium text-gray-900">{{ item.tooth }}</td>
            <td class="whitespace-nowrap px-3 py-2.5 font-medium text-gray-900">{{ item.surface }}</td>
            <td class="whitespace-nowrap px-3 py-2.5 font-medium text-gray-900">{{ item.code }}</td>
            <td class="px-3 py-2.5 font-medium text-gray-900">{{ item.note }}</td>
            <td class="px-3 py-2.5 text-right font-medium text-gray-900">{{ item.price }}</td>
            <td class="px-3 py-2.5 text-right font-semibold text-red-600">{{ item.discount }}</td>
            <td class="whitespace-nowrap px-3 py-2.5 font-medium text-gray-900">{{ item.doctor }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="flex justify-end gap-6 text-sm">
      <div class="text-right">
        <p class="text-gray-600">Хөнгөлөлт</p>
        <p class="font-semibold text-red-600">{{ discountText }}</p>
      </div>
      <div class="text-right">
        <p class="text-gray-600">Нийт дүн</p>
        <p class="text-lg font-semibold text-gray-900">{{ totalText }}</p>
      </div>
    </div>
  </div>
</template>
