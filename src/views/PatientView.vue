<script setup>
import { reactive } from 'vue'
import TopBar from '@/components/clinic/TopBar.vue'
import PatientProfileCard from '@/components/clinic/PatientProfileCard.vue'
import PatientHealthWarnings from '@/components/clinic/PatientHealthWarnings.vue'
import TreatmentPlanTable from '@/components/clinic/TreatmentPlanTable.vue'
import TreatmentHistoryTable from '@/components/clinic/TreatmentHistoryTable.vue'
import RecallCard from '@/components/clinic/RecallCard.vue'
import CalendarCard from '@/components/clinic/CalendarCard.vue'
import TodayScheduleCard from '@/components/clinic/TodayScheduleCard.vue'

const state = reactive({
  patient: {
    initials: 'БЭ',
    name: 'Б.Эрдэнэ',
    age: 25,
    gender: 'Эр',
    bloodType: 'O(I) Rh+',
    register: 'УУ99203405',
    birthDate: '2000-01-01',
    profession: 'Программист',
    phone: '88112233',
    phoneAlt: '99112233',
    email: 'bat.erdene@gmail.com',
    address: 'УБ, 25-р хороо, Баянгол дүүрэг, 89-12',
  },
  allergies: ['Пенициллин', 'Лидокаин'],
  complaints: ['Шүд янгинаж өвдөнө', 'Буйл хавдсан'],
  plans: [
    { id: 1, date: '2025-11-23', name: 'Шүдний цоорол (CoSe)', status: 'saved', doctor: 'Др. Болд' },
    { id: 2, date: '2025-11-28', name: 'Үүдэн шүд авах (38)', status: 'saved', doctor: 'Др. Туяа' },
  ],
  history: [
    {
      id: 1,
      date: '2025-10-20',
      tooth: 'Шүд 36',
      surface: 'MOD',
      code: 'K02.1',
      note: 'Эмчилгээ (бөглөө)',
      price: '150,000₮',
      discount: '-',
      doctor: 'Др. Болд',
    },
    {
      id: 2,
      date: '2025-10-25',
      tooth: 'Шүд 46',
      surface: 'O',
      code: 'K04.0',
      note: 'Эмчилгээ',
      price: '70,000₮',
      discount: '-10,000₮',
      doctor: 'Др. Туяа',
    },
  ],
  recall: {
    title: 'Дахин дуудаx',
    count: 2,
    type: 'Урьдчилан сэргийлэх',
    date: '2026-05-28',
  },
  calendarDays: [
    { label: '27', muted: true },
    { label: '28', muted: true },
    { label: '29', muted: true },
    { label: '30', muted: true },
    { label: '30', muted: true },
    { label: '31', muted: true },
    { label: '1' },
    { label: '2' },
    { label: '3' },
    { label: '4' },
    { label: '5' },
    { label: '6' },
    { label: '7' },
    { label: '8' },
    { label: '9' },
    { label: '10' },
    { label: '11' },
    { label: '12' },
    { label: '13' },
    { label: '14' },
    { label: '15' },
    { label: '16' },
    { label: '17' },
    { label: '18' },
    { label: '19' },
    { label: '20' },
    { label: '21' },
    { label: '22' },
    { label: '23' },
    { label: '24' },
    { label: '25' },
    { label: '26' },
    { label: '27' },
    { label: '28' },
    { label: '29' },
    { label: '30' },
    { label: '31' },
  ],
  appointments: [
    { time: '14:00', name: 'Д. Амар', subtitle: 'Шүдний үзлэг', duration: '30 мин', active: true },
    { time: '16:00', name: 'Н. Ариунаа', subtitle: 'Консультаци', duration: '45 мин', active: false },
    { time: '18:30', name: 'Ж. Түмэн', subtitle: 'Шүдний эмчилгээ', duration: '30 мин', active: false },
  ],
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <TopBar />
    <div class="max-w-7xl mx-auto px-6 lg:px-8 pb-12">
      <div class="grid grid-cols-[320px_1fr_340px] gap-6 mt-6">
        <div class="flex flex-col gap-6">
          <PatientProfileCard :patient="state.patient" />
          <PatientHealthWarnings :allergies="state.allergies" :complaints="state.complaints" />
        </div>
        <div class="flex flex-col gap-6">
          <TreatmentPlanTable :plans="state.plans" />
          <TreatmentHistoryTable :history="state.history" discount-text="—10,000₮" total-text="220,000₮" />
        </div>
        <div class="flex flex-col gap-6">
          <RecallCard
            :title="state.recall.title"
            :count="state.recall.count"
            :type="state.recall.type"
            :date="state.recall.date"
          />
          <CalendarCard month-label="December 2025" selected-date="1" :days="state.calendarDays" />
          <TodayScheduleCard :appointments="state.appointments" />
        </div>
      </div>
    </div>
  </div>
</template>
