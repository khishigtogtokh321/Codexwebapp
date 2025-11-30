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
      { time: '14:00', name: 'Д. Амар', subtitle: 'Шүдний үзлэг', duration: '30 мин', active: true },
      { time: '16:00', name: 'Н. Ариунаа', subtitle: 'Консультаци', duration: '45 мин', active: false },
      { time: '18:30', name: 'Ж. Түмэн', subtitle: 'Шүдний эмчилгээ', duration: '30 мин', active: false },
    ],
  },
})

const emit = defineEmits(['filter'])

function handleFilter() {
  emit('filter')
}
</script>

<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-5 space-y-4">
    <div class="flex items-center justify-between">
      <p class="text-xl font-semibold text-gray-900">{{ title }}</p>
      <button
        type="button"
        class="text-sm font-semibold text-emerald-600 hover:text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-50"
        @click="handleFilter"
      >
        {{ filterLabel }}
      </button>
    </div>
    <div class="space-y-2 max-h-[320px] overflow-y-auto pr-1">
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
