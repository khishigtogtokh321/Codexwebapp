<script setup>
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
</script>

<template>
  <div class="space-y-4 rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-gray-900">Хийгдсэн эмчилгээ</h2>
    </div>

    <div class="overflow-hidden rounded-xl border border-gray-200">
      <table class="min-w-full divide-y divide-gray-200 text-sm">
        <thead class="bg-gray-50 text-gray-600">
          <tr>
            <th class="px-3 py-3 text-left font-semibold">Огноо</th>
            <th class="px-3 py-3 text-left font-semibold">Шүд</th>
            <th class="px-3 py-3 text-left font-semibold">Гадаргуу</th>
            <th class="px-3 py-3 text-left font-semibold">Код</th>
            <th class="px-3 py-3 text-left font-semibold">Тайлбар / Онош</th>
            <th class="px-3 py-3 text-right font-semibold">Үнэ</th>
            <th class="px-3 py-3 text-right font-semibold">Хөнгөлөлт</th>
            <th class="px-3 py-3 text-left font-semibold">Эмч</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 text-gray-900">
          <tr v-if="loading">
            <td colspan="8" class="px-3 py-6 text-center text-gray-500">Уншиж байна...</td>
          </tr>
          <tr v-else-if="history.length === 0">
            <td colspan="8" class="px-3 py-6 text-center text-gray-500">Түүх хоосон байна</td>
          </tr>
          <tr
            v-else
            v-for="item in history"
            :key="item.id || item.date + item.tooth"
            class="hover:bg-gray-50"
          >
            <td class="whitespace-nowrap px-3 py-3 font-medium text-gray-900">{{ item.date }}</td>
            <td class="whitespace-nowrap px-3 py-3 font-medium text-gray-900">{{ item.tooth }}</td>
            <td class="whitespace-nowrap px-3 py-3 font-medium text-gray-900">{{ item.surface }}</td>
            <td class="whitespace-nowrap px-3 py-3 font-medium text-gray-900">{{ item.code }}</td>
            <td class="px-3 py-3 font-medium text-gray-900">{{ item.note }}</td>
            <td class="px-3 py-3 text-right font-medium text-gray-900">{{ item.price }}</td>
            <td class="px-3 py-3 text-right font-semibold text-red-600">{{ item.discount }}</td>
            <td class="whitespace-nowrap px-3 py-3 font-medium text-gray-900">{{ item.doctor }}</td>
          </tr>
        </tbody>
      </table>
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
