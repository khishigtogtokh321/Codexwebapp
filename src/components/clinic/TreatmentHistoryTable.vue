<script setup>
import { computed } from 'vue'
import InfoRow from './InfoRow.vue'
import SectionCard from './SectionCard.vue'

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
  <SectionCard title="Хийгдсэн эмчилгээ">
    <template #actions>
      <div class="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-gray-700">
        <span
          v-for="badge in summaryBadges"
          :key="badge.label"
          class="pill pill--muted text-[11px]"
        >
          <span class="text-gray-500">{{ badge.label }}:</span>
          <span class="text-gray-900">{{ badge.value }}</span>
        </span>
      </div>
    </template>

    <div class="hidden md:block">
      <div class="dental-table-shell">
        <div class="dental-table-shell__scroll">
          <table class="dental-table">
            <thead>
              <tr>
                <th class="text-left">Огноо</th>
                <th class="text-left">Шүд</th>
                <th class="text-left">Гадаргуу</th>
                <th class="text-left">Код</th>
                <th class="text-left">Тайлбар / Онош</th>
                <th class="text-right">Үнэ</th>
                <th class="text-right">Хөнгөлөлт</th>
                <th class="text-left">Эмч</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="8" class="text-center text-gray-500">Уншиж байна...</td>
              </tr>
              <tr v-else-if="history.length === 0">
                <td colspan="8" class="text-center text-gray-500">Түүх хоосон байна</td>
              </tr>
              <tr
                v-else
                v-for="(item, index) in history"
                :key="item.id || item.date + item.tooth"
                class="cursor-pointer"
                @dblclick="emit('open-detail', { item, index })"
              >
                <td class="whitespace-nowrap font-semibold">{{ item.date }}</td>
                <td class="whitespace-nowrap font-semibold">{{ item.tooth }}</td>
                <td class="whitespace-nowrap font-semibold">{{ item.surface }}</td>
                <td class="whitespace-nowrap font-semibold">{{ item.code }}</td>
                <td class="font-semibold">{{ item.note }}</td>
                <td class="text-right font-semibold">{{ item.price }}</td>
                <td class="text-right font-semibold text-red-600">{{ item.discount }}</td>
                <td class="whitespace-nowrap font-semibold">{{ item.doctor }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="space-y-2 md:hidden">
      <div v-if="loading" class="text-center text-gray-500">Уншиж байна...</div>
      <div v-else-if="history.length === 0" class="text-center text-gray-500">Түүх хоосон байна</div>
      <div
        v-else
        v-for="(item, index) in history"
        :key="item.id || item.date + item.tooth"
        class="history-card"
        @click="emit('open-detail', { item, index })"
      >
        <div class="history-card__meta">
          <span>{{ item.code }}</span>
          <div class="history-card__chips">
            <span class="pill pill--muted text-xs">{{ item.date }}</span>
            <span v-if="item.tooth" class="pill pill--muted text-xs">Шүд #{{ item.tooth }}</span>
            <span v-if="item.surface" class="pill pill--soft text-xs">{{ item.surface }}</span>
          </div>
        </div>
        <p class="text-sm font-semibold text-gray-900 leading-tight">{{ item.note }}</p>
        <div class="grid grid-cols-2 gap-2 text-sm">
          <InfoRow label="Үнэ">
            <template #default>{{ item.price }}</template>
          </InfoRow>
          <InfoRow label="Хөнгөлөлт">
            <template #default>
              <span class="text-red-600 font-semibold">{{ item.discount }}</span>
            </template>
          </InfoRow>
          <InfoRow label="Эмч" :value="item.doctor" />
        </div>
      </div>
    </div>

    <div class="summary-grid">
      <div class="summary-block">
        <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Хөнгөлөлт</p>
        <p class="text-base font-semibold text-red-600">{{ discountText }}</p>
      </div>
      <div class="summary-block">
        <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Нийт дүн</p>
        <p class="text-lg font-semibold text-gray-900">{{ totalText }}</p>
      </div>
    </div>
  </SectionCard>
</template>
