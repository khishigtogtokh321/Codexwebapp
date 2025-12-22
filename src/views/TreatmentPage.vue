<script setup>
import { reactive, computed, ref } from 'vue'
import TopBar from '@/components/layout/TopBar.vue'
import SideNav from '@/components/layout/SideNav.vue'
import ToothChart from '@/components/tooth/ToothChart.vue'
import TreatmentAddStepper from '@/components/treatment/TreatmentAddStepper.vue'
import TreatmentQuickAddDrawer from '@/components/treatment/TreatmentQuickAddDrawer.vue'
import HistorySearchBar from '@/components/history/HistorySearchBar.vue'
import TreatmentHistoryTable from '@/components/history/TreatmentHistoryTable.vue'
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
const isCollapsed = ref(false)
const isMobileNavOpen = ref(false)
const isQuickAddOpen = ref(false)

const quickAddState = reactive({
  selectedTreatments: [],
})

const { toothStatuses, updateToothStatusFromTreatment } = useToothStatus(mockToothStatuses)

const selectedTeethList = computed(() => state.selectedTeeth)
const selectedSurfacesList = computed(() => state.selectedSurfaces)
const selectedTreatmentIds = computed(() => state.selectedTreatments)

const hasSelectedTeeth = computed(() => selectedTeethList.value.length > 0)
const hasSelectedTreatments = computed(() => selectedTreatmentIds.value.length > 0)

const availableTreatments = computed(() => treatmentTypes)

const selectedDiagnosisLabels = computed(() => getDiagnosisLabels(state.selectedDiagnoses))

const diagnosisDisabled = computed(() => !hasSelectedTeeth.value)
const requiresToothSelection = computed(() =>
  getSelectedTreatments(state.selectedTreatments).some(
    (treatment) => getTreatmentScope(treatment) === TREATMENT_SCOPE.TOOTH,
  ),
)
const canSubmit = computed(
  () => hasSelectedTreatments.value && (!requiresToothSelection.value || hasSelectedTeeth.value),
)

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

function selectSurface(surface) {
  if (!hasSelectedTeeth.value) return
  if (state.selectedSurfaces.includes(surface)) {
    state.selectedSurfaces = state.selectedSurfaces.filter((s) => s !== surface)
  } else {
    state.selectedSurfaces = [...state.selectedSurfaces, surface]
  }
}

function selectTreatment(typeId) {
  const treatment = getTreatmentById(typeId)
  if (!treatment) return
  state.selectedTreatments = state.selectedTreatments.includes(typeId)
    ? state.selectedTreatments.filter((id) => id !== typeId)
    : [...state.selectedTreatments, typeId]
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
  const toothDiagnosisText = diagnosisLabels.join(', ') || 'Онош сонгоогүй'

  let addedToothTreatment = false
  let addedGeneralTreatment = false

  treatments.forEach((treatment) => {
    if (!treatment) return
    const scope = getTreatmentScope(treatment)
    if (scope === TREATMENT_SCOPE.GENERAL) {
      const diagnosisText = diagnosisLabels.join(', ') || treatment.label
      const entry = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        tooth: '',
        surface: '',
        diagnosis: diagnosisText,
        treatmentType: treatment.label,
        doctor: '',
        price: '',
        status: state.selectedStatus || 'done',
      }
      state.treatmentLog.unshift(entry)
      addedGeneralTreatment = true
      return
    }

    if (!selectedTeeth.length) return
    selectedTeeth.forEach((tooth) => {
      const entry = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        tooth: formatToothNumber(tooth),
        surface: surfaceText,
        diagnosis: toothDiagnosisText,
        treatmentType: treatment.label || treatment.id,
        doctor: '',
        price: '',
        status: state.selectedStatus || 'done',
      }
      state.treatmentLog.unshift(entry)
      updateToothStatusFromTreatment(entry)
      addedToothTreatment = true
    })
  })

  if (addedToothTreatment) {
    state.selectedSurfaces = []
    state.selectedDiagnoses = []
    state.selectedTreatments = []
  } else if (addedGeneralTreatment) {
    state.selectedTreatments = []
  }
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

function handleSearch(query) {
  searchQuery.value = query
}

function handleFilterStatus(status) {
  statusFilter.value = status || 'all'
}

function handleDeleteTreatment(treatmentId) {
  state.treatmentLog = state.treatmentLog.filter((t) => t.id !== treatmentId)
}

function toggleDiagnosis(code) {
  if (diagnosisDisabled.value) return
  if (state.selectedDiagnoses.includes(code)) {
    state.selectedDiagnoses = state.selectedDiagnoses.filter((d) => d !== code)
  } else {
    state.selectedDiagnoses = [...state.selectedDiagnoses, code]
  }
}

function handleStatusChange(status) {
  state.selectedStatus = status
}

function handlePatientSelected(patient) {
  activePatient.value = patient || activePatient.value
}

function toggleSidebar() {
  const isDesktop = typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
  if (!isDesktop) return
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
  <div class="flex flex-col md:flex-row min-h-screen bg-gray-50 overflow-hidden">
   
    <aside
      class="relative hidden flex-shrink-0 transition-all duration-300 lg:block"
      :class="isCollapsed ? 'w-20' : 'w-64'"
    >
      <SideNav
        :is-collapsed="isCollapsed"
        active-id="treatments"
        @toggle="toggleSidebar"
        @navigate="handleNavigate"
      />
    </aside>

    <div class="flex-1 flex flex-col overflow-hidden relative">
      <div class="lg:hidden flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-white">
        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <TreatmentAddStepper
                  :selected-teeth="selectedTeethList"
                  :selected-surfaces="selectedSurfacesList"
                  :selected-diagnoses="state.selectedDiagnoses"
                  :selected-treatments="selectedTreatmentIds"
                  :treatments="availableTreatments"
                  @surface-toggle="selectSurface"
                  @diagnosis-toggle="toggleDiagnosis"
                  @treatment-toggle="selectTreatment"
                  @add-treatment="handleAddTreatment"
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
        class="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 shadow-xl lg:hidden"
      >
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <div class="flex items-center gap-2 text-white font-semibold">
            <span class="bg-blue-600 w-8 h-8 flex items-center justify-center rounded-lg">A</span>
            <span>AshidSoft</span>
          </div>
          <button
            type="button"
            class="p-2 rounded-md text-gray-200 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
    </transition>
  </div>
</template>
