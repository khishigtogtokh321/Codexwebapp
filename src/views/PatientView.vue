<script setup>
import { reactive, ref } from 'vue'
import TopBar from '@/components/clinic/TopBar.vue'
import PatientProfileCard from '@/components/clinic/PatientProfileCard.vue'
import PatientHealthWarnings from '@/components/clinic/PatientHealthWarnings.vue'
import TreatmentPlanTable from '@/components/clinic/TreatmentPlanTable.vue'
import TreatmentHistoryTable from '@/components/clinic/TreatmentHistoryTable.vue'
import RecallCard from '@/components/clinic/RecallCard.vue'
import CalendarCard from '@/components/clinic/CalendarCard.vue'
import TodayScheduleCard from '@/components/clinic/TodayScheduleCard.vue'
import TreatmentSidebar from '@/components/treatment/TreatmentSidebar.vue'
import SideNav from '@/components/layout/SideNav.vue'
import { treatmentTypes } from '@/data/treatmentTypes'

const breadcrumbs = ['Жагсаалт', 'Эмчилгээний карт']

const state = reactive({
  patient: {
    initials: 'BE',
    name: 'Б.Төрболд',
    age: 25,
    gender: 'Эр',
    bloodType: 'O(I) Rh+',
    register: 'УЖ99203405',
    birthDate: '2000-01-01',
    profession: 'Программист',
    phone: '88112233',
    phoneAlt: '99112233',
    email: 'bat.erdene@gmail.com',
    address: 'БЗД, 25-р хороо, Наран зам 89-12',
  },
  allergies: ['Пенициллин', 'Лидокаин'],
  complaints: ['Шүд янгинаж өвдөнө', 'Буйл хавдсан'],
  plans: [
    { date: '2025-11-23', name: 'Сувгийн эмчилгээ (CoSe)', status: 'saved', doctor: 'Др. Ану' },
    { date: '2025-11-28', name: 'Шүд авах (38)', status: 'saved', doctor: 'Др. Төрболд' },
  ],
  history: [
    {
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
  recall: {
    title: 'Дахин дуудлага',
    count: 1,
    type: 'Урьдчилан сэргийлэх',
    date: '2026-05-28',
  },
  calendarDays: [
    { label: '27', muted: true },
    { label: '28', muted: true },
    { label: '29', muted: true },
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
    { label: '1', muted: true },
    { label: '2', muted: true },
    { label: '3', muted: true },
    { label: '4', muted: true },
    { label: '5', muted: true },
    { label: '6', muted: true },
  ],
  appointments: [
    { time: '14:00', name: 'Г. Саран', subtitle: 'Түрүүвэр үзлэг', duration: '30 мин', active: true },
    { time: '15:30', name: 'Д. Болд', subtitle: 'Шүд авах', duration: '45 мин' },
  ],
})

const showSidebar = ref(false)
const sidebarState = reactive({
  selectedTeeth: [],
  selectedSurfaces: [],
  selectedStatus: 'planned',
  selectedTreatmentTypes: [],
  treatmentDisabled: false,
})

const isCollapsed = ref(false)
const isMobileNavOpen = ref(false)

function toggleSidebar() {
  showSidebar.value = !showSidebar.value
}

function closeSidebar() {
  showSidebar.value = false
}

function handleSurfaceToggle(surface) {
  if (sidebarState.selectedSurfaces.includes(surface)) {
    sidebarState.selectedSurfaces = sidebarState.selectedSurfaces.filter((s) => s !== surface)
  } else {
    sidebarState.selectedSurfaces = [...sidebarState.selectedSurfaces, surface]
  }
}

function handleStatusChange(status) {
  sidebarState.selectedStatus = status
}

function handleTreatmentTypeSelect(typeId) {
  if (sidebarState.selectedTreatmentTypes.includes(typeId)) {
    sidebarState.selectedTreatmentTypes = sidebarState.selectedTreatmentTypes.filter((id) => id !== typeId)
  } else {
    sidebarState.selectedTreatmentTypes = [...sidebarState.selectedTreatmentTypes, typeId]
  }
}

function handleAddTreatment() {
  closeSidebar()
}

function toggleNav() {
  isCollapsed.value = !isCollapsed.value
}

function openMobileNav() {
  isMobileNavOpen.value = true
}

function closeMobileNav() {
  isMobileNavOpen.value = false
}

function handleNavigate(id) {
  window.location.hash = `#${id}`
  if (isMobileNavOpen.value) {
    closeMobileNav()
  }
}
</script>

<template>
  <div class="flex min-h-screen bg-slate-50">
    <aside
      class="relative hidden flex-shrink-0 transition-all duration-300 lg:block"
      :class="isCollapsed ? 'w-20' : 'w-64'"
    >
      <SideNav
        :is-collapsed="isCollapsed"
        active-id="patients"
        @toggle="toggleNav"
        @navigate="handleNavigate"
      />
    </aside>

    <div class="flex-1 overflow-hidden">
      <div class="flex flex-col">
        <div class="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 shadow-sm lg:hidden">
          <button
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            @click="openMobileNav"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <p class="text-base font-semibold text-gray-900">Эмчилгээний карт</p>
        </div>

        <TopBar :breadcrumbs="breadcrumbs" card-id="2511002" placeholder="Өвчтөн хайх (Нэр, РД, Утас...)" />

        <main class="flex-1 overflow-y-auto">
          <div class="mx-auto w-full max-w-[1500px] px-4 pb-12 pt-6 lg:px-6">
            <div class="grid grid-cols-1 gap-5 xl:grid-cols-12">
              <div class="flex flex-col gap-5 xl:col-span-3">
                <PatientProfileCard :patient="state.patient" />
                <PatientHealthWarnings :allergies="state.allergies" :complaints="state.complaints" />
              </div>

              <div class="flex flex-col gap-5 xl:col-span-6">
                <TreatmentPlanTable :plans="state.plans" />
                <TreatmentHistoryTable
                  :history="state.history"
                  discount-text="-10,000₮"
                  total-text="220,000₮"
                />
              </div>

              <div class="flex flex-col gap-5 xl:col-span-3 xl:ml-auto xl:max-w-[360px]">
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
        </main>
      </div>
    </div>
  </div>

  <button
    type="button"
    class="fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
    @click="toggleSidebar"
  >
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m-7-7h14" />
    </svg>
    Эмчилгээ нэмэх
  </button>

  <transition name="fade">
    <div
      v-if="showSidebar"
      class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
      @click="closeSidebar"
    ></div>
  </transition>
  <transition name="slide">
    <aside
      v-if="showSidebar"
      class="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
    >
      <div class="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <p class="text-lg font-semibold text-gray-900">Эмчилгээ нэмэх</p>
        <button
          type="button"
          class="rounded-full border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
          @click="closeSidebar"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="flex-1 overflow-y-auto">
        <TreatmentSidebar
          :selected-teeth="sidebarState.selectedTeeth"
          :selected-surfaces="sidebarState.selectedSurfaces"
          :selected-status="sidebarState.selectedStatus"
          :selected-treatment-types="sidebarState.selectedTreatmentTypes"
          :treatments="treatmentTypes"
          :treatment-disabled="sidebarState.treatmentDisabled"
          @surface-toggle="handleSurfaceToggle"
          @status-change="handleStatusChange"
          @treatment-type-select="handleTreatmentTypeSelect"
          @add-treatment="handleAddTreatment"
          @cancel="closeSidebar"
        />
      </div>
    </aside>
  </transition>

  <transition name="fade">
    <div
      v-if="isMobileNavOpen"
      class="fixed inset-0 z-40 bg-black/50 lg:hidden"
      @click="closeMobileNav"
    ></div>
  </transition>
  <transition name="slide">
    <div
      v-if="isMobileNavOpen"
      class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:hidden"
    >
      <div class="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div class="flex items-center gap-2 text-gray-900 font-semibold">
          <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">A</span>
          <span>AshidSoft</span>
        </div>
        <button
          type="button"
          class="rounded-md p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          @click="closeMobileNav"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <SideNav :is-collapsed="false" active-id="patients" @toggle="closeMobileNav" @navigate="handleNavigate" />
    </div>
  </transition>
</template>
