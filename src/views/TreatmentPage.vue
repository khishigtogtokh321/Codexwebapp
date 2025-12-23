<script setup>
import { reactive, computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import TopBar from '@/components/layout/TopBar.vue'
import SideNav from '@/components/layout/SideNav.vue'
import ToothChart from '@/components/tooth/ToothChart.vue'
import RightTreatmentWizard from '@/components/treatment/RightTreatmentWizard.vue'
import TreatmentQuickAddDrawer from '@/components/treatment/TreatmentQuickAddDrawer.vue'
import HistorySearchBar from '@/components/history/HistorySearchBar.vue'
import TreatmentHistoryTable from '@/components/history/TreatmentHistoryTable.vue'
import { mockToothStatuses } from '@/data'
import { wizardTreatmentTypes } from '@/data/treatmentWizardOptions'
import { useToothStatus } from '@/composables/useToothStatus'
import { formatToothNumber } from '@/utils/toothHelpers'
import patientService from '@/services/patientService'

const state = reactive({
  selectedTeeth: [],
  selectedSurfaces: [],
  selectedDiagnosis: null,
  selectedTypeId: '',
  selectedCode: null,
  selectedStatus: 'planned',
  treatmentLog: [],
})

const searchQuery = ref('')
const statusFilter = ref('all')
const activePatient = ref(patientService.getDefaultPatient())
const hovered = ref(false)
const pinned = ref(false)
const drawerOpen = ref(false)
const isLgUp = ref(false)
const drawerTriggerRef = ref(null)
const drawerCloseRef = ref(null)

const desktopExpanded = computed(() => isLgUp.value && (hovered.value || pinned.value))

const { toothStatuses, updateToothStatusFromTreatment } = useToothStatus(mockToothStatuses)

const selectedTeethList = computed(() => state.selectedTeeth)
const selectedType = computed(() => wizardTreatmentTypes.find((item) => item.id === state.selectedTypeId) || null)
const hasSelectedTeeth = computed(() => selectedTeethList.value.length > 0)

const filteredLog = computed(() => {
  let list = state.treatmentLog
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      (item) =>
        (item.treatmentType || '').toLowerCase().includes(q) || (item.diagnosis || '').toLowerCase().includes(q),
    )
  }
  if (statusFilter.value !== 'all') {
    list = list.filter((item) => item.status === statusFilter.value)
  }
  return list
})

function getDiagnosisLabel(diagnosis) {
  if (!diagnosis?.code) return ''
  return `${diagnosis.code} · ${diagnosis.name || ''}`.trim()
}

function showError(message) {
  window.alert(message)
}

function selectTooth(teeth) {
  const next = Array.isArray(teeth) ? teeth.filter(Boolean) : teeth ? [teeth] : []
  state.selectedTeeth = [...new Set(next)]
  if (!hasSelectedTeeth.value) {
    state.selectedSurfaces = []
    state.selectedDiagnosis = null
  }
}

function handleWizardSurfacesUpdate(surfaces) {
  state.selectedSurfaces = Array.isArray(surfaces) ? surfaces : []
}

function handleWizardDiagnosisUpdate(diagnosis) {
  state.selectedDiagnosis = diagnosis || null
}

function handleWizardTypeUpdate(typeId) {
  state.selectedTypeId = typeId || ''
  if (!state.selectedTypeId) {
    state.selectedCode = null
  }
}

function handleWizardCodeUpdate(code) {
  state.selectedCode = code
}

function handleAddTreatmentFromWizard() {
  const type = selectedType.value
  const code = state.selectedCode
  const payload = {
    teeth: state.selectedTeeth,
    surfaces: state.selectedSurfaces,
    diagnosis: state.selectedDiagnosis,
    typeId: state.selectedTypeId,
    code,
  }

  if (!payload.teeth.length) {
    showError('Эхлээд шүд сонгоно уу')
    return
  }

  if (!payload.code) {
    showError('Эмчилгээний код сонгоно уу')
    return
  }

  if (type?.surfaceRequired && payload.surfaces.length === 0) {
    showError('Гадаргуу сонгоно уу')
    return
  }

  const surfaceText = payload.surfaces.join(', ')
  const diagnosisText = getDiagnosisLabel(payload.diagnosis) || 'Онош сонгоогүй'
  const treatmentLabel = `${payload.code.code} · ${type?.label || payload.code.name}`

  payload.teeth.forEach((tooth) => {
    const entry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      tooth: formatToothNumber(tooth),
      surface: surfaceText,
      diagnosis: diagnosisText,
      treatmentType: treatmentLabel,
      doctor: '',
      price: '',
      status: state.selectedStatus || 'planned',
    }
    state.treatmentLog.unshift(entry)
    updateToothStatusFromTreatment(entry)
  })

  state.selectedSurfaces = []
  state.selectedDiagnosis = null
  state.selectedTypeId = ''
  state.selectedCode = null
}

function handleSearch(query) {
  searchQuery.value = query
}

function handleFilterStatus(status) {
  statusFilter.value = status || 'all'
}

function handleDeleteTreatment(treatmentId) {
  state.treatmentLog = state.treatmentLog.filter((t) => t.id !== treatmentId)
}

function handlePatientSelected(patient) {
  activePatient.value = patient || activePatient.value
}

function toggleSidebar() {
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
})

onBeforeUnmount(() => {
  mediaQuery?.removeEventListener('change', updateBreakpoint)
  window.removeEventListener('keydown', handleEsc)
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
  <div class="flex flex-col md:flex-row min-h-screen bg-gray-50 overflow-hidden">

    <aside class="relative z-40 hidden flex-shrink-0 lg:block">
      <div class="w-24"></div>
      <div
        class="absolute top-0 h-full left-0 transition-all duration-300 ease-in-out"
        :class="desktopExpanded ? 'w-48' : 'w-24'"
        @mouseenter="hovered = true"
        @mouseleave="hovered = false"
      >
        <SideNav
          :is-collapsed="!desktopExpanded"
          :is-pinned="pinned"
          active-id="treatments"
          @toggle="toggleSidebar"
          @toggle-pin="toggleSidebar"
          @navigate="handleNavigate"
        />
      </div>
    </aside>

    <div class="relative flex flex-1 flex-col overflow-hidden">
      <div class="lg:hidden flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-white">
        <button
          type="button"
          ref="drawerTriggerRef"
          class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Open navigation"
          @click="openMobileNav"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <p class="text-sm font-semibold text-gray-800">Эмчилгээ</p>
      </div>

      <TopBar :active-patient="activePatient" @patient-selected="handlePatientSelected" />
      <main class="flex-1 overflow-y-auto bg-gray-100">
        <div class="p-4 md:p-6 space-y-4">
      

          <div class="grid gap-4 lg:grid-cols-12 items-start">
            <div class="space-y-4 lg:col-span-8">
              <ToothChart
                class="h-full"
                :selected-teeth="selectedTeethList"
                :tooth-statuses="toothStatuses"
                :multi-select="true"
                @teeth-select="selectTooth"
                @select-all="selectTooth"
                @clear-selection="() => selectTooth([])"
              />


            </div>

            <div class="lg:col-span-4 lg:pl-1 space-y-3">
              <div class="sticky top-4">
                <div class="flex justify-end">
                  <RightTreatmentWizard
                    :selected-teeth="selectedTeethList"
                    @update:surfaces="handleWizardSurfacesUpdate"
                    @update:diagnosis="handleWizardDiagnosisUpdate"
                    @confirm="handleAddTreatmentFromWizard"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="dental-card p-4 md:p-5 space-y-3">
            <h2 class="text-lg md:text-xl font-semibold text-gray-900">
              Эмчилгээний түүх
            </h2>

            <HistorySearchBar
              :search-query="searchQuery"
              :status-filter="statusFilter"
              @search="handleSearch"
              @filter-status="handleFilterStatus"
            />

            <div class="overflow-x-auto">
              <TreatmentHistoryTable
                :treatments="filteredLog"
                :loading="false"
                @edit="() => {}"
                @delete="handleDeleteTreatment"
              />
            </div>
          </div>
        </div>
      </main>
    </div>

    <button
      type="button"
      class="fixed bottom-6 right-6 z-40 min-h-[48px] inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      @click="handleAddTreatmentFromWizard"
    >
      + Эмчилгээ нэмэх
    </button>

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
        class="fixed inset-y-0 left-0 z-50 w-72 max-w-[90vw] bg-gray-900 shadow-2xl transition-transform duration-300 lg:hidden"
      >
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <div class="flex items-center gap-2 text-white font-semibold">
            <span class="bg-blue-600 w-8 h-8 flex items-center justify-center rounded-lg">A</span>
            <span>AshidSoft</span>
          </div>
          <button
            type="button"
            ref="drawerCloseRef"
            class="p-2 rounded-md text-gray-200 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close navigation"
            @click="closeMobileNav"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <SideNav
          :is-collapsed="false"
          :allow-collapse="false"
          active-id="treatments"
          @navigate="handleNavigate"
        />
      </div>
    </Transition>
  </div>
</template>
