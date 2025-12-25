<script setup>
import { reactive, computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import TopBar from '@/components/layout/TopBar.vue'
import SideNav from '@/components/layout/SideNav.vue'
import ToothChart from '@/components/tooth/ToothChart.vue'
import TreatmentQuickAddDrawer from '@/components/treatment/TreatmentQuickAddDrawer.vue'
import HistorySearchBar from '@/components/history/HistorySearchBar.vue'
import TreatmentHistoryTable from '@/components/history/TreatmentHistoryTable.vue'
import RightTreatmentWizard from '@/components/treatment/RightTreatmentWizard.vue'
import { treatmentTypes, getTreatmentById } from '@/data/treatmentTypes'
import { diagnoses, mockToothStatuses } from '@/data'
import { useToothStatus } from '@/composables/useToothStatus'
import { formatToothNumber } from '@/utils/toothHelpers'
import { getTreatmentScope, TREATMENT_SCOPE } from '@/utils/treatmentScope'
import patientService from '@/services/patientService'

const state = reactive({
  selectedTeeth: [],
  selectedSurfaces: [],
  selectedTreatments: [],
  selectedDiagnoses: [],
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
const isQuickAddOpen = ref(false)
const drawerTriggerRef = ref(null)
const drawerCloseRef = ref(null)

const quickAddState = reactive({
  selectedTreatments: [],
})

const desktopExpanded = computed(() => isLgUp.value && (hovered.value || pinned.value))

const { toothStatuses, updateToothStatusFromTreatment } = useToothStatus(mockToothStatuses)

const selectedTeethList = computed(() => state.selectedTeeth)
const selectedTreatmentIds = computed(() => state.selectedTreatments)

const hasSelectedTeeth = computed(() => selectedTeethList.value.length > 0)

const availableTreatments = computed(() => treatmentTypes)

const quickAddRequiresToothSelection = computed(() =>
  getSelectedTreatments(quickAddState.selectedTreatments).some(
    (treatment) => getTreatmentScope(treatment) === TREATMENT_SCOPE.TOOTH,
  ),
)
const quickAddCanSubmit = computed(
  () =>
    quickAddState.selectedTreatments.length > 0 &&
    (!quickAddRequiresToothSelection.value || hasSelectedTeeth.value),
)


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

function getDiagnosisLabels(codes) {
  return codes.map((code) => {
    const match = diagnoses.find((d) => d.code === code)
    return match ? `${match.code} · ${match.name}` : code
  })
}

function getSelectedTreatments(ids) {
  return ids.map((id) => getTreatmentById(id)).filter(Boolean)
}

function selectTooth(teeth) {
  const next = Array.isArray(teeth) ? teeth.filter(Boolean) : teeth ? [teeth] : []
  state.selectedTeeth = [...new Set(next)]
  if (!hasSelectedTeeth.value) {
    state.selectedSurfaces = []
    state.selectedDiagnoses = []
    state.selectedTreatments = []
  }
}

function handleSurfacesUpdate(surfaces = []) {
  state.selectedSurfaces = Array.isArray(surfaces) ? surfaces : []
}

function handleDiagnosisUpdate(diagnosis) {
  state.selectedDiagnoses = diagnosis?.code ? [diagnosis.code] : []
}

function canCommitSelection({ selectedTeeth = [], selectedTreatments = [] }) {
  if (!selectedTreatments.length) return false
  const requiresTooth = getSelectedTreatments(selectedTreatments).some(
    (treatment) => getTreatmentScope(treatment) === TREATMENT_SCOPE.TOOTH,
  )
  return !requiresTooth || selectedTeeth.length > 0
}

function commitAddTreatment({
  selectedTeeth = state.selectedTeeth,
  selectedSurfaces = state.selectedSurfaces,
  selectedDiagnoses = state.selectedDiagnoses,
  selectedTreatments = state.selectedTreatments,
} = {}) {
  const treatments = getSelectedTreatments(selectedTreatments)
  if (!treatments.length) return

  const diagnosisLabels = getDiagnosisLabels(selectedDiagnoses)
  const surfaceText = selectedSurfaces.join(', ')
  const toothText = selectedTeeth.map((tooth) => formatToothNumber(tooth)).join(', ')
  const treatmentText = treatments
    .map((treatment) => treatment?.label || treatment?.id)
    .filter(Boolean)
    .join(', ')
  const fallbackDiagnosis = treatments
    .map((treatment) => treatment?.label)
    .filter(Boolean)
    .join(', ')
  const diagnosisText = diagnosisLabels.join(', ') || fallbackDiagnosis || '???? ?????????'
  const status = state.selectedStatus || 'done'

  const entry = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    tooth: toothText,
    surface: surfaceText,
    diagnosis: diagnosisText,
    treatmentType: treatmentText,
    doctor: '',
    price: '',
    status,
  }

  state.treatmentLog.unshift(entry)

  if (selectedTeeth.length) {
    selectedTeeth.forEach((tooth) => {
      treatments.forEach((treatment) => {
        if (!treatment) return
        updateToothStatusFromTreatment({
          tooth: formatToothNumber(tooth),
          treatmentType: treatment.label || treatment.id,
          status,
        })
      })
    })
  }

  state.selectedSurfaces = []
  state.selectedDiagnoses = []
  state.selectedTreatments = []
  state.selectedTeeth = []
}


function handleAddTreatment(overrides = {}) {
  const payload = {
    selectedTeeth: state.selectedTeeth,
    selectedSurfaces: state.selectedSurfaces,
    selectedDiagnoses: state.selectedDiagnoses,
    selectedTreatments: state.selectedTreatments,
    ...overrides,
  }
  if (!canCommitSelection(payload)) return
  commitAddTreatment(payload)
}

function openQuickAdd() {
  isQuickAddOpen.value = true
}

function closeQuickAdd() {
  isQuickAddOpen.value = false
  quickAddState.selectedTreatments = []
}

function toggleQuickAddTreatment(typeId) {
  const treatment = getTreatmentById(typeId)
  if (!treatment) return
  quickAddState.selectedTreatments = quickAddState.selectedTreatments.includes(typeId)
    ? quickAddState.selectedTreatments.filter((id) => id !== typeId)
    : [...quickAddState.selectedTreatments, typeId]
}

function handleQuickAdd() {
  if (!quickAddCanSubmit.value) return
  handleAddTreatment({
    selectedTreatments: quickAddState.selectedTreatments,
    selectedSurfaces: [],
    selectedDiagnoses: [],
  })
  closeQuickAdd()
}

function handleWizardAdd(selectedCodes = []) {
  if (!Array.isArray(selectedCodes) || selectedCodes.length === 0) return
  if (!state.selectedTeeth?.length) return

  const diagnosisLabels = getDiagnosisLabels(state.selectedDiagnoses)
  const surfaceText = state.selectedSurfaces.join(', ')
  const toothText = state.selectedTeeth.map((tooth) => formatToothNumber(tooth)).join(', ')
  const treatmentText = selectedCodes
    .map((codeItem) => [codeItem?.code, codeItem?.nameMn].filter(Boolean).join(' '))
    .filter(Boolean)
    .join(', ')
  const fallbackDiagnosis = selectedCodes
    .map((codeItem) => codeItem?.nameMn || codeItem?.code)
    .filter(Boolean)
    .join(', ')
  const diagnosisText = diagnosisLabels.join(', ') || fallbackDiagnosis || '???? ?????????'
  const status = state.selectedStatus || 'done'

  const entry = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    tooth: toothText,
    surface: surfaceText,
    diagnosis: diagnosisText,
    treatmentType: treatmentText,
    doctor: '',
    price: '',
    status,
  }

  state.treatmentLog.unshift(entry)

  state.selectedTeeth.forEach((tooth) => {
    selectedCodes.forEach((codeItem) => {
      if (!codeItem) return
      updateToothStatusFromTreatment({
        tooth: formatToothNumber(tooth),
        treatmentType: [codeItem.code, codeItem.nameMn].filter(Boolean).join(' '),
        status,
      })
    })
  })

  state.selectedSurfaces = []
  state.selectedDiagnoses = []
  state.selectedTreatments = []
  state.selectedTeeth = []
}


function handleSearch(query) {
  searchQuery.value = query
}

function handleFilterStatus(status) {
  statusFilter.value = status || 'all'
}

function handleEditTreatment(updated) {
  if (!updated?.id) return
  const index = state.treatmentLog.findIndex((t) => t.id === updated.id)
  if (index === -1) return
  state.treatmentLog.splice(index, 1, { ...state.treatmentLog[index], ...updated })
  const teeth = (updated.tooth || '')
    .split(',')
    .map((tooth) => tooth.trim())
    .filter(Boolean)
  teeth.forEach((tooth) => {
    updateToothStatusFromTreatment({
      tooth,
      treatmentType: updated.treatmentType,
      status: updated.status,
    })
  })
}

function handleDeleteTreatment(treatmentId) {
  state.treatmentLog = state.treatmentLog.filter((t) => t.id !== treatmentId)
}

function handleStatusChange(status) {
  state.selectedStatus = status
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
      

          <div class="grid gap-4 lg:grid-cols-12 items-start lg:items-stretch">
            <div class="space-y-4 lg:col-span-8">
              <ToothChart
                class="h-auto lg:h-auto"
                :selected-teeth="selectedTeethList"
                :tooth-statuses="toothStatuses"
                :multi-select="true"
                @teeth-select="selectTooth"
                @select-all="selectTooth"
                @clear-selection="() => selectTooth([])"
              />


            </div>

            <div class="lg:col-span-4 lg:pl-1 space-y-3 fill-height">
              <div class="sticky top-4 fill-height">
                <RightTreatmentWizard
                  :selected-teeth="selectedTeethList"
                  @update:surfaces="handleSurfacesUpdate"
                  @update:diagnosis="handleDiagnosisUpdate"
                  @add="handleWizardAdd"
                />
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
                :patient="activePatient"
                @edit="handleEditTreatment"
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
      @click="openQuickAdd"
    >
      + Эмчилгээ нэмэх
    </button>

    <TreatmentQuickAddDrawer
      :open="isQuickAddOpen"
      :selected-teeth="selectedTeethList"
      :selected-treatments="quickAddState.selectedTreatments"
      :treatments="availableTreatments"
      @close="closeQuickAdd"
      @treatment-toggle="toggleQuickAddTreatment"
      @add="handleQuickAdd"
    />

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
