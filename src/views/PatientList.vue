<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import TopBar from '@/components/layout/TopBar.vue'
import SideNav from '@/components/layout/SideNav.vue'
import patientService from '@/services/patientService'
import { mockPatient } from '@/data'
import { getInitials } from '@/utils/formatters'

const hovered = ref(false)
const pinned = ref(false)
const drawerOpen = ref(false)
const isLgUp = ref(false)
const desktopExpanded = computed(() => isLgUp.value && (hovered.value || pinned.value))
const drawerTriggerRef = ref(null)
const drawerCloseRef = ref(null)

const patients = ref([])
const loading = ref(true)
const searchTerm = ref('')
let loadTimeout

const skeletonRows = computed(() => Array.from({ length: 8 }, (_, index) => index))
const totalCount = computed(() => patients.value.length || 0)
const emptyState = computed(() => !loading.value && filteredPatients.value.length === 0)

const normalizeValue = (value = '') => value.toString().toLowerCase()

const filteredPatients = computed(() => {
  const term = normalizeValue(searchTerm.value).trim()
  if (!term) return patients.value
  return patients.value.filter((patient) =>
    [patient.name, patient.phone, patient.rd, patient.cardNo, patient.id].some((field) =>
      normalizeValue(field).includes(term),
    ),
  )
})

function normalizePatient(patient, index = 0) {
  const id = patient.id || patient.cardNo || patient.cardNumber || patient.patientId || `P-${index + 1}`
  const name =
    patient.fullName ||
    patient.name ||
    [patient.lastName, patient.firstName].filter(Boolean).join(' ').trim() ||
    '-'
  const rd = patient.rd || patient.registerNo || patient.register || patient.registerNumber || '-'
  const phone = patient.phone || patient.mobile || patient.contact || '-'
  const cardNo = patient.cardNo || patient.cardNumber || patient.cardId || patient.id || '-'
  const lastVisit = patient.lastVisit || patient.last_visit || patient.lastSeen || '-'
  const lastTreatment = patient.lastTreatment || patient.last_treatment || patient.reason || ''

  return {
    id,
    name,
    rd,
    phone,
    cardNo,
    lastVisit,
    lastTreatment,
    initials: patient.initials || getInitials(name || id),
  }
}

function loadPatients() {
  const primary = patientService.getDefaultPatient()
  const seedPatients = [
    {
      ...primary,
      id: primary?.id || primary?.cardNumber || 'P-001',
      firstName: primary?.firstName || 'Анударь',
      lastName: primary?.lastName || 'Бат-Эрдэнэ',
      rd: primary?.register || 'УЖ80010123',
      phone: primary?.phone || '99112233',
      cardNo: primary?.cardNumber || '2024-001',
      lastVisit: '2024-11-20',
      lastTreatment: 'Шүд цэвэрлэгээ',
    },
    {
      id: 'P-002',
      firstName: 'Мөнх-Эрдэнэ',
      lastName: 'Сарангэрэл',
      phone: '88110022',
      rd: 'УЖ81042111',
      cardNo: '2024-002',
      lastVisit: '2024-10-18',
      lastTreatment: 'Сувгийн эмчилгээ',
    },
    {
      id: 'P-003',
      firstName: 'Сувдмаа',
      lastName: 'Ганчимэг',
      phone: '99003344',
      rd: 'УЖ95090212',
      cardNo: '2024-003',
      lastVisit: '2024-09-04',
      lastTreatment: 'Цоорлын эмчилгээ',
    },
    {
      id: 'P-004',
      firstName: 'Тэмүүлэн',
      lastName: 'Энхжин',
      phone: '95117788',
      rd: 'УЖ88021477',
      cardNo: '2024-004',
      lastVisit: '2024-08-26',
      lastTreatment: 'Шүдний цэвэрлэгээ',
    },
    {
      id: 'P-005',
      firstName: 'Номин',
      lastName: 'Төрмандах',
      phone: '70112233',
      rd: 'УЖ99010134',
      cardNo: '2024-005',
      lastVisit: '2024-07-12',
      lastTreatment: 'Үзлэг',
    },
    {
      id: mockPatient.id || 'P-006',
      fullName: mockPatient.name,
      phone: mockPatient.phone,
      rd: mockPatient.registerNo || 'УЖ93030566',
      cardNo: mockPatient.id || mockPatient.cardNumber || '2024-006',
      lastVisit: mockPatient.lastVisit || '2024-06-18',
      lastTreatment: 'Төлөвлөгөөт үзлэг',
    },
  ]

  loading.value = true
  window.clearTimeout(loadTimeout)
  loadTimeout = window.setTimeout(() => {
    patients.value = seedPatients.map((patient, index) => normalizePatient(patient, index))
    loading.value = false
  }, 260)
}

function toggleNav() {
  pinned.value = !pinned.value
}

function openMobileNav() {
  drawerOpen.value = true
}

function closeMobileNav() {
  drawerOpen.value = false
}

function handleNavigate(id) {
  window.location.hash = `#${id}`
  if (drawerOpen.value) {
    closeMobileNav()
  }
}

function goToPatient(patient) {
  if (!patient?.id) return
  window.location.hash = `#patient?pid=${encodeURIComponent(patient.id)}`
}

function resetSearch() {
  searchTerm.value = ''
}

const handleEsc = (event) => {
  if (event.key === 'Escape' && drawerOpen.value) {
    closeMobileNav()
  }
}

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
  loadPatients()
})

onBeforeUnmount(() => {
  mediaQuery?.removeEventListener('change', updateBreakpoint)
  window.removeEventListener('keydown', handleEsc)
  window.clearTimeout(loadTimeout)
})

watch(
  () => drawerOpen.value,
  async (open) => {
    const html = document.documentElement
    const body = document.body
    if (!html || !body) return
    html.classList.toggle('overflow-hidden', open)
    body.classList.toggle('overflow-hidden', open)
    if (open) {
      await nextTick()
      drawerCloseRef.value?.focus?.()
    } else if (!isLgUp.value) {
      drawerTriggerRef.value?.focus?.()
    }
  },
)
</script>

<template>
  <div class="flex min-h-[100dvh] bg-slate-50">
    <aside class="relative z-40 hidden flex-shrink-0 lg:block">
      <div class="w-24"></div>
      <div
        class="absolute inset-y-0 left-0 transition-all duration-300 ease-in-out"
        :class="desktopExpanded ? 'w-48' : 'w-24'"
        @mouseenter="hovered = true"
        @mouseleave="hovered = false"
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

    <div class="flex min-w-0 flex-1 flex-col">
      <div class="flex flex-col">
        <div class="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 shadow-sm lg:hidden">
          <button
            type="button"
            ref="drawerTriggerRef"
            class="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Open navigation"
            @click="openMobileNav"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <p class="text-base font-semibold text-gray-900">Өвчтөнүүд</p>
        </div>

        <TopBar />

        <main class="flex-1 bg-slate-50">
          <div class="mx-auto w-full max-w-[1500px] px-4 pb-16 pt-6 lg:px-6 lg:pb-12">
            <div class="flex flex-col gap-4 lg:gap-5">
              <div class="ui-toolbar">
                <div class="ui-toolbar__titles">
                  <span class="patient-thumb h-[2.5rem] w-[2.5rem] text-base">Ө</span>
                  <div class="min-w-0">
                    <p class="ui-toolbar__title">Өвчтөнүүд</p>
                    <p class="text-sm font-semibold text-gray-500">Харилцагчийн бүртгэл</p>
                  </div>
                </div>
                <div class="flex flex-1 flex-wrap items-center justify-end gap-2 sm:gap-3">
                  <span class="ui-toolbar__meta">
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l3.5 3.5" />
                    </svg>
                    {{ filteredPatients.length }} / {{ totalCount }}
                  </span>
                  <label class="ui-input w-full sm:max-w-[360px] lg:max-w-[420px]">
                    <svg class="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 10-10.61-10.6 7.5 7.5 0 0010.6 10.6z" />
                    </svg>
                    <input
                      v-model="searchTerm"
                      type="search"
                      inputmode="search"
                      autocomplete="off"
                      class="ui-input__field"
                      placeholder="Нэр, утас, регистр, картын дугаараар хайх"
                    />
                  </label>
                  <button type="button" class="ui-btn ui-btn--ghost" aria-label="Filters (placeholder)">
                    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M7 12h10M10 17h4" />
                    </svg>
                    Шүүлтүүр
                  </button>
                  <button type="button" class="ui-btn ui-btn--primary" aria-label="Add patient">
                    + Өвчтөн нэмэх
                  </button>
                  <button
                    v-if="searchTerm"
                    type="button"
                    class="ui-btn ui-btn--ghost"
                    aria-label="Clear search"
                    @click="resetSearch"
                  >
                    Цэвэрлэх
                  </button>
                </div>
              </div>

              <div class="card patient-list-panel">
                <div v-if="loading" class="space-y-3">
                  <div v-for="row in skeletonRows" :key="row" class="patient-card">
                    <div class="patient-card__row">
                      <div class="patient-meta w-full">
                        <span class="patient-thumb opacity-70"></span>
                        <div class="min-w-0 flex-1 space-y-1">
                          <span class="skeleton-line"></span>
                          <span class="skeleton-line skeleton-line--short"></span>
                        </div>
                      </div>
                      <div class="w-24">
                        <span class="skeleton-line"></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else-if="emptyState" class="patient-empty">
                  <p class="text-lg font-semibold text-gray-800">Илэрц олдсонгүй</p>
                  <p class="text-sm text-gray-500">Хайлт болон шүүлтүүрээ өөрчилж дахин оролдоно уу.</p>
                  <button type="button" class="ui-btn ui-btn--ghost" @click="resetSearch">
                    Цэвэрлэх
                  </button>
                </div>

                <template v-else>
                  <div class="hidden lg:block">
                    <div class="patient-table-shell">
                      <div class="patient-table__scroll scrollbar-thin">
                        <table class="patient-table">
                          <thead>
                            <tr>
                              <th scope="col">Өвчтөн</th>
                              <th scope="col">Утас</th>
                              <th scope="col">РД</th>
                              <th scope="col">Сүүлд ирсэн</th>
                              <th scope="col">Сүүлийн эмчилгээ</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="patient in filteredPatients"
                              :key="patient.id"
                              class="patient-row"
                              role="button"
                              tabindex="0"
                              @click="goToPatient(patient)"
                              @keypress.enter="goToPatient(patient)"
                              @keypress.space.prevent="goToPatient(patient)"
                            >
                              <td>
                                <div class="patient-meta">
                                  <span class="patient-thumb">{{ patient.initials }}</span>
                                  <div class="min-w-0">
                                    <p class="patient-name truncate">{{ patient.name }}</p>
                                    <p class="patient-subtext truncate">Карт: {{ patient.cardNo }}</p>
                                  </div>
                                </div>
                              </td>
                              <td class="patient-subtext">{{ patient.phone }}</td>
                              <td class="patient-subtext">{{ patient.rd }}</td>
                              <td class="patient-subtext">{{ patient.lastVisit }}</td>
                              <td>
                                <span class="badge-soft" v-if="patient.lastTreatment">
                                  {{ patient.lastTreatment }}
                                </span>
                                <span v-else class="patient-subtext">-</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div class="space-y-3 lg:hidden">
                    <button
                      v-for="patient in filteredPatients"
                      :key="patient.id"
                      type="button"
                      class="patient-card"
                      @click="goToPatient(patient)"
                    >
                      <div class="patient-card__row">
                        <div class="patient-meta min-w-0">
                          <span class="patient-thumb">{{ patient.initials }}</span>
                          <div class="min-w-0">
                            <p class="patient-name truncate">{{ patient.name }}</p>
                            <p class="patient-subtext truncate">{{ patient.phone }}</p>
                          </div>
                        </div>
                        <span class="badge-soft">Карт: {{ patient.cardNo }}</span>
                      </div>
                      <div class="patient-card__meta">
                        <div class="patient-subtext">РД: {{ patient.rd }}</div>
                        <div class="patient-subtext">Сүүлд: {{ patient.lastVisit }}</div>
                        <div v-if="patient.lastTreatment" class="patient-subtext">
                          Эмчилгээ: {{ patient.lastTreatment }}
                        </div>
                      </div>
                    </button>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>

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
    <div
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
          ref="drawerCloseRef"
          class="rounded-md p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-label="Close navigation"
          @click="closeMobileNav"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <SideNav :is-collapsed="false" :allow-collapse="false" active-id="patients" @toggle="closeMobileNav" @navigate="handleNavigate" />
    </div>
  </Transition>
</template>
