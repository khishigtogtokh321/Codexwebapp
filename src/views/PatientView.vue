<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
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
  risks: ['Даралт ихсэх', 'Цус шингэлэгч хэрэглэдэг'],
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
const isDetailOpen = ref(false)
const isDetailEditing = ref(false)
const detailItem = ref(null)
const detailIndex = ref(-1)

const sidebarState = reactive({
  selectedTeeth: [],
  selectedSurfaces: [],
  selectedStatus: 'planned',
  selectedTreatmentTypes: [],
  treatmentDisabled: false,
})
const hovered = ref(false)
const pinned = ref(false)
const drawerOpen = ref(false)
const isLgUp = ref(false)
const desktopExpanded = computed(() => isLgUp.value && (hovered.value || pinned.value))
<<<<<<< ours
=======
const contentPaddingClass = computed(() => (desktopExpanded.value ? 'lg:pl-72' : 'lg:pl-24'))
>>>>>>> theirs

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
  pinned.value = !pinned.value
  pinned.value = !pinned.value
}

function openMobileNav() {
  drawerOpen.value = true
  drawerOpen.value = true
}

function closeMobileNav() {
  drawerOpen.value = false
  drawerOpen.value = false
}

function handleNavigate(id) {
  window.location.hash = `#${id}`
  if (drawerOpen.value) {
<<<<<<< ours
    closeMobileNav()
  }
}

const handleEsc = (event) => {
  if (event.key === 'Escape' && drawerOpen.value) {
=======
>>>>>>> theirs
    closeMobileNav()
  }
}

<<<<<<< ours
=======
const handleEsc = (event) => {
  if (event.key === 'Escape' && drawerOpen.value) {
    closeMobileNav()
  }
}

>>>>>>> theirs
let mediaQuery

const updateBreakpoint = () => {
  if (typeof window === 'undefined') return
  if (!mediaQuery) {
    mediaQuery = window.matchMedia('(min-width: 1024px)')
  }
  isLgUp.value = mediaQuery?.matches || false
  if (mediaQuery?.matches) {
    drawerOpen.value = false
  }
}

onMounted(() => {
  updateBreakpoint()
  mediaQuery?.addEventListener('change', updateBreakpoint)
  window.addEventListener('keydown', handleEsc)
})

onBeforeUnmount(() => {
  mediaQuery?.removeEventListener('change', updateBreakpoint)
  window.removeEventListener('keydown', handleEsc)
})

watch(
  () => drawerOpen.value,
  (open) => {
    const html = document.documentElement
    const body = document.body
    if (!html || !body) return
    html.classList.toggle('overflow-hidden', open)
    body.classList.toggle('overflow-hidden', open)
  },
)

function handleOpenDetail(payload) {
  detailItem.value = payload?.item ? { ...payload.item } : null
  detailIndex.value = payload?.index ?? -1
  isDetailEditing.value = false
  isDetailOpen.value = Boolean(detailItem.value)
}

function closeDetailModal() {
  isDetailOpen.value = false
  isDetailEditing.value = false
  detailItem.value = null
  detailIndex.value = -1
}

function startDetailEdit() {
  if (!detailItem.value) return
  isDetailEditing.value = true
}

function handleDetailField(field, value) {
  if (!detailItem.value) return
  detailItem.value = { ...detailItem.value, [field]: value }
}

function deleteDetail() {
  if (detailIndex.value < 0) {
    closeDetailModal()
    return
  }
  state.history.splice(detailIndex.value, 1)
  closeDetailModal()
}

function cancelDetailEdit() {
  if (detailIndex.value < 0) {
    closeDetailModal()
    return
  }
  detailItem.value = { ...state.history[detailIndex.value] }
  isDetailEditing.value = false
}

function saveDetail() {
  if (!detailItem.value || detailIndex.value < 0) {
    closeDetailModal()
    return
  }
  const updated = { ...state.history[detailIndex.value], ...detailItem.value }
  state.history.splice(detailIndex.value, 1, updated)
  isDetailEditing.value = false
  isDetailOpen.value = false
}
</script>

<template>
  <div class="flex min-h-screen bg-slate-50">
    <aside
      class="relative hidden flex-shrink-0 lg:block"
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
    >
<<<<<<< ours
      <div class="w-24"></div>
=======
>>>>>>> theirs
      <div
        class="absolute inset-y-0 left-0 transition-all duration-300 ease-in-out"
        :class="desktopExpanded ? 'w-72' : 'w-24'"
      >
        <SideNav
          :is-collapsed="!desktopExpanded"
          :is-pinned="pinned"
          active-id="patients"
          @toggle="toggleNav"
          @toggle-pin="toggleNav"
          @navigate="handleNavigate"
        />
      </div>
    </aside>

    <div
      class="flex-1 overflow-hidden transition-[padding-left] duration-200 ease-out"
      :class="contentPaddingClass"
    >
    <div
      class="flex-1 overflow-hidden transition-[padding-left] duration-200 ease-out"
      :class="contentPaddingClass"
    >
      <div class="flex flex-col">
        <div class="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 shadow-sm lg:hidden">
          <button
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Open navigation"
            aria-label="Open navigation"
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
          <div class="mx-auto w-full max-w-[1500px] px-4 pb-16 pt-6 lg:px-6 lg:pb-12">
            <div class="grid grid-cols-1 gap-5 xl:grid-cols-12">
              <div class="flex flex-col gap-4 xl:col-span-3">
                <PatientProfileCard :patient="state.patient" />
                <PatientHealthWarnings
                  :allergies="state.allergies"
                  :complaints="state.complaints"
                  :risks="state.risks"
                />
              </div>

              <div class="flex flex-col gap-4 xl:col-span-6">
                <TreatmentPlanTable :plans="state.plans" />
                <TreatmentHistoryTable
                  :history="state.history"
                  discount-text="-10,000₮"
                  total-text="220,000₮"
                  @open-detail="handleOpenDetail"
                />
              </div>

              <div class="flex flex-col gap-4 pb-4 xl:col-span-3 xl:ml-auto xl:max-w-[360px]">
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
    class="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
    @click="toggleSidebar"
  >
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m-7-7h14" />
    </svg>
    Эмчилгээ нэмэх
  </button>

  <transition name="fade">
    <div
      v-if="isDetailOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      @click.self="closeDetailModal"
    >
      <div class="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
        <div class="flex items-start justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <p class="text-xs uppercase tracking-wide text-gray-500">Эмчилгээний дэлгэрэнгүй</p>
            <h3 class="text-lg font-semibold text-gray-900">
              {{ detailItem?.code || '---' }} · {{ detailItem?.note || 'Тайлбар байхгүй' }}
            </h3>
            <p class="mt-1 flex items-center gap-2 text-sm text-gray-600">
              <span class="rounded-md bg-emerald-50 px-2 py-1 font-semibold text-emerald-700">
                {{ detailItem?.date || '---- -- --' }}
              </span>
              <span v-if="detailItem?.tooth" class="rounded-md bg-blue-50 px-2 py-1 font-semibold text-blue-700">
                Шүд #{{ detailItem?.tooth }}
              </span>
              <span v-if="detailItem?.surface" class="rounded-md bg-sky-50 px-2 py-1 font-semibold text-sky-700">
                {{ detailItem?.surface }}
              </span>
              <span v-if="detailItem?.doctor" class="text-gray-700">{{ detailItem?.doctor }}</span>
            </p>
          </div>
          <button
            type="button"
            class="rounded-full p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            @click="closeDetailModal"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="grid gap-4 px-5 py-4 md:grid-cols-2">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Огноо</label>
            <input
              v-if="isDetailEditing"
              type="date"
              class="w-full rounded-lg border border-gray-200 bg-white text-sm shadow-sm transition-all duration-150 hover:border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/60"
              :value="detailItem?.date"
              @input="handleDetailField('date', $event.target.value)"
            />
            <p v-else class="text-gray-900">{{ detailItem?.date || '-----' }}</p>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Шүд</label>
            <input
              v-if="isDetailEditing"
              type="text"
              class="w-full rounded-lg border border-gray-200 bg-white text-sm shadow-sm transition-all duration-150 hover:border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/60"
              :value="detailItem?.tooth"
              @input="handleDetailField('tooth', $event.target.value)"
            />
            <p v-else class="text-gray-900">{{ detailItem?.tooth || '—' }}</p>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Гадаргуу</label>
            <input
              v-if="isDetailEditing"
              type="text"
              class="w-full rounded-lg border border-gray-200 bg-white text-sm shadow-sm transition-all duration-150 hover:border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/60"
              :value="detailItem?.surface"
              @input="handleDetailField('surface', $event.target.value)"
            />
            <p v-else class="text-gray-900">{{ detailItem?.surface || '—' }}</p>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Онош / Код</label>
            <input
              v-if="isDetailEditing"
              type="text"
              class="w-full rounded-lg border border-gray-200 bg-white text-sm shadow-sm transition-all duration-150 hover:border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/60"
              :value="detailItem?.code"
              @input="handleDetailField('code', $event.target.value)"
            />
            <p v-else class="text-gray-900">{{ detailItem?.code || '—' }}</p>
          </div>

          <div class="md:col-span-2 space-y-2">
            <label class="block text-sm font-medium text-gray-700">Тэмдэглэл</label>
            <textarea
              v-if="isDetailEditing"
              rows="3"
              class="w-full rounded-lg border border-gray-200 bg-white text-sm shadow-sm transition-all duration-150 hover:border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/60"
              :value="detailItem?.note"
              @input="handleDetailField('note', $event.target.value)"
            ></textarea>
            <p v-else class="text-gray-900">{{ detailItem?.note || '—' }}</p>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Үнэ</label>
            <input
              v-if="isDetailEditing"
              type="text"
              class="w-full rounded-lg border border-gray-200 bg-white text-sm shadow-sm transition-all duration-150 hover:border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/60"
              :value="detailItem?.price"
              @input="handleDetailField('price', $event.target.value)"
            />
            <p v-else class="text-gray-900">{{ detailItem?.price || '—' }}</p>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Хөнгөлөлт</label>
            <input
              v-if="isDetailEditing"
              type="text"
              class="w-full rounded-lg border border-gray-200 bg-white text-sm shadow-sm transition-all duration-150 hover:border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/60"
              :value="detailItem?.discount"
              @input="handleDetailField('discount', $event.target.value)"
            />
            <p v-else class="text-gray-900">{{ detailItem?.discount || '—' }}</p>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Эмч</label>
            <input
              v-if="isDetailEditing"
              type="text"
              class="w-full rounded-lg border border-gray-200 bg-white text-sm shadow-sm transition-all duration-150 hover:border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/60"
              :value="detailItem?.doctor"
              @input="handleDetailField('doctor', $event.target.value)"
            />
            <p v-else class="text-gray-900">{{ detailItem?.doctor || '—' }}</p>
          </div>
        </div>

        <div class="flex items-center justify-between border-t border-gray-200 px-5 py-4">
          <p class="text-sm text-gray-500">Мөрийг давхар дарахад дэлгэрэнгүй нээгдэнэ</p>
          <div class="flex items-center gap-2">
            <button
              v-if="!isDetailEditing"
              type="button"
              class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              @click="closeDetailModal"
            >
              Хаах
            </button>
            <button
              v-if="!isDetailEditing"
              type="button"
              class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
              @click="startDetailEdit"
            >
              Засах
            </button>
            <template v-else>
              <button
                type="button"
                class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                @click="cancelDetailEdit"
              >
                Болих
              </button>
              <button
                type="button"
                class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                @click="saveDetail"
              >
                Хадгалах
              </button>
              <button
                type="button"
                class="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                @click="deleteDetail"
              >
                Устгах
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </transition>

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

  <Transition
    enter-active-class="transition-opacity duration-200"
    leave-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
  <Transition
    enter-active-class="transition-opacity duration-200"
    leave-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="drawerOpen"
      v-if="drawerOpen"
      class="fixed inset-0 z-40 bg-black/50 lg:hidden"
      @click="closeMobileNav"
    ></div>
  </Transition>
  <Transition
    enter-active-class="transform transition-transform duration-300"
    leave-active-class="transform transition-transform duration-300"
    enter-from-class="-translate-x-full"
    enter-to-class="translate-x-0"
    leave-from-class="translate-x-0"
    leave-to-class="-translate-x-full"
  >
  </Transition>
  <Transition
    enter-active-class="transform transition-transform duration-300"
    leave-active-class="transform transition-transform duration-300"
    enter-from-class="-translate-x-full"
    enter-to-class="translate-x-0"
    leave-from-class="translate-x-0"
    leave-to-class="-translate-x-full"
  >
    <div
      v-if="drawerOpen"
      class="fixed inset-y-0 left-0 z-50 w-72 max-w-[90vw] bg-white shadow-2xl lg:hidden"
      v-if="drawerOpen"
      class="fixed inset-y-0 left-0 z-50 w-72 max-w-[90vw] bg-white shadow-2xl lg:hidden"
    >
      <div class="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div class="flex items-center gap-2 text-gray-900 font-semibold">
          <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">A</span>
          <span>AshidSoft</span>
        </div>
        <button
          type="button"
          class="rounded-md p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-label="Close navigation"
          aria-label="Close navigation"
          @click="closeMobileNav"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <SideNav :is-collapsed="false" :allow-collapse="false" active-id="patients" @toggle="closeMobileNav" @navigate="handleNavigate" />
      <SideNav :is-collapsed="false" :allow-collapse="false" active-id="patients" @toggle="closeMobileNav" @navigate="handleNavigate" />
    </div>
  </Transition>
  </Transition>
</template>
