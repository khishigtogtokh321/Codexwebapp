<script setup>
import AppointmentRow from './AppointmentRow.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Өнөөдрийн цаг',
  },
  filterLabel: {
    type: String,
    default: 'Бүгд',
  },
  appointments: {
    type: Array,
    default: () => [
      { time: '14:00', name: 'Г. Саран', subtitle: 'Түрүүвэр үзлэг', duration: '30 мин', active: true },
      { time: '15:30', name: 'Д. Болд', subtitle: 'Шүд авах', duration: '45 мин', active: false },
    ],
  },
})

const emit = defineEmits(['filter'])

function handleFilter() {
  emit('filter')
}
</script>

<template>
  <div class="w-full max-w-[360px] space-y-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
    <div class="flex items-center justify-between">
      <p class="text-lg font-semibold text-gray-900">{{ title }}</p>
      <button
        type="button"
        class="rounded-lg px-3 py-1.5 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50"
        @click="handleFilter"
      >
        {{ filterLabel }}
      </button>
    </div>
    <div class="max-h-[280px] space-y-2 overflow-y-auto pr-1">
      <AppointmentRow
        v-for="(appt, index) in appointments"
        :key="appt.time + appt.name + index"
        :time="appt.time"
        :name="appt.name"
        :subtitle="appt.subtitle"
        :duration="appt.duration"
        :active="appt.active"
        :accent="appt.accent || 'emerald'"
      />
    </div>
  </div>
</template>
