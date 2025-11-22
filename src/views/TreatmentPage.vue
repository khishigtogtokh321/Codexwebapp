<script setup>
import { reactive, computed, ref } from 'vue'
import SideNav from '@/components/layout/SideNav.vue'
import PatientHeader from '@/components/patient/PatientHeader.vue'
import ToothChart from '@/components/tooth/ToothChart.vue'
import TreatmentSidebar from '@/components/treatment/TreatmentSidebar.vue'
import HistorySearchBar from '@/components/history/HistorySearchBar.vue'
import TreatmentHistoryTable from '@/components/history/TreatmentHistoryTable.vue'
import { treatmentTypes, getTreatmentById } from '@/data/treatmentTypes'
import { mockPatient, mockToothStatuses } from '@/data'
import { useToothStatus } from '@/composables/useToothStatus'
import { formatToothNumber } from '@/utils/toothHelpers'

const state = reactive({
  selectedTeeth: [],
  selectedSurfaces: [],
  selectedTreatments: [],
  selectedDiagnoses: [],
  selectedStatus: 'planned',
  treatmentLog: [],
})

const searchQuery = ref('')

const { toothStatuses, updateToothStatusFromTreatment } = useToothStatus(mockToothStatuses)

const selectedTeethList = computed(() => state.selectedTeeth)
const selectedSurfacesList = computed(() => state.selectedSurfaces)
const selectedTreatmentIds = computed(() => state.selectedTreatments)

const filteredToothTreatments = computed(() => treatmentTypes.filter((t) => t.toothRequired))
const filteredGeneralTreatments = computed(() => treatmentTypes.filter((t) => !t.toothRequired))

const availableTreatments = computed(() => (state.selectedTeeth.length ? filteredToothTreatments.value : filteredGeneralTreatments.value))

const surfaceDisabled = computed(() => state.selectedTeeth.length === 0)
const treatmentSelectorDisabled = computed(() => false)

const filteredLog = computed(() => {
  if (!searchQuery.value) return state.treatmentLog
  const q = searchQuery.value.toLowerCase()
  return state.treatmentLog.filter((item) =>
    (item.treatmentType || '').toLowerCase().includes(q) ||
    (item.diagnosis || '').toLowerCase().includes(q)
  )
})

const patientStats = computed(() => ({
  totalTreatments: state.treatmentLog.length,
  completedTreatments: state.treatmentLog.filter((t) => t.status === 'done').length,
  plannedTreatments: state.treatmentLog.filter((t) => t.status !== 'done').length,
}))

function selectTooth(teeth) {
  const next = Array.isArray(teeth) ? teeth.filter(Boolean) : teeth ? [teeth] : []
  state.selectedTeeth = [...new Set(next)]
  if (state.selectedTeeth.length === 0) {
    state.selectedSurfaces = []
    state.selectedTreatments = []
  }
}

function selectSurface(surface) {
  if (!state.selectedTeeth.length) return
  if (state.selectedSurfaces.includes(surface)) {
    state.selectedSurfaces = state.selectedSurfaces.filter((s) => s !== surface)
  } else {
    state.selectedSurfaces = [...state.selectedSurfaces, surface]
  }
}

function selectStatus(status) {
  state.selectedStatus = status
}

function selectTreatment(typeId) {
  const treatment = getTreatmentById(typeId)
  if (!treatment) return
  if (treatment.toothRequired === false) {
    applyGeneralWorkflow(treatment)
    return
  }
  state.selectedTreatments = state.selectedTreatments.includes(typeId)
    ? state.selectedTreatments.filter((id) => id !== typeId)
    : [...state.selectedTreatments, typeId]
}

function applyToothWorkflow() {
  if (!state.selectedTeeth.length || !state.selectedSurfaces.length || !state.selectedTreatments.length) return
  const surfaceText = state.selectedSurfaces.join(', ')
  state.selectedTeeth.forEach((tooth) => {
    state.selectedTreatments.forEach((treatmentId) => {
      const treatment = getTreatmentById(treatmentId)
      const label = treatment?.label || treatmentId
      const entry = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        tooth: formatToothNumber(tooth),
        surface: surfaceText,
        diagnosis: label,
        treatmentType: label,
        doctor: '',
        price: '',
        status: state.selectedStatus || 'done',
      }
      state.treatmentLog.unshift(entry)
      updateToothStatusFromTreatment(entry)
    })
  })
  state.selectedSurfaces = []
  state.selectedTreatments = []
}

function applyGeneralWorkflow(treatment) {
  const entry = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    tooth: '',
    surface: '',
    diagnosis: treatment.label,
    treatmentType: treatment.label,
    doctor: '',
    price: '',
    status: state.selectedStatus || 'done',
  }
  state.treatmentLog.unshift(entry)
}

function handleAddTreatment() {
  applyToothWorkflow()
}

function handleCancel() {
  state.selectedSurfaces = []
  state.selectedTreatments = []
  state.selectedStatus = 'planned'
  state.selectedTeeth = []
}

function handleSearch(query) {
  searchQuery.value = query
}

function handleFilterStatus() {
  // Placeholder: status filter not required for current workflows
}

function handleDeleteTreatment(treatmentId) {
  state.treatmentLog = state.treatmentLog.filter((t) => t.id !== treatmentId)
}
</script>

<template>
  <div class="flex flex-col lg:flex-row h-screen bg-gray-50 overflow-hidden">
    <!-- Left Sidebar Navigation - Hidden on mobile, show on large screens -->
    <div class="hidden lg:block lg:w-64 flex-shrink-0 bg-gray-900">
      <SideNav />
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Patient Header -->
      <div class="flex-shrink-0 p-4 md:p-6 bg-white border-b border-gray-200">
        <PatientHeader :patient="mockPatient" :stats="patientStats" />
      </div>

      <!-- Content Area -->
      <div class="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
        <!-- Top Grid: Tooth Chart + Treatment Details -->
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
          <!-- Left: Tooth Chart (3 cols on desktop) -->
          <div class="lg:col-span-3">
            <ToothChart
              :selected-teeth="selectedTeethList"
              :tooth-statuses="toothStatuses"
              :multi-select="true"
              @teeth-select="selectTooth"
              @select-all="selectTooth"
              @clear-selection="() => selectTooth([])"
            />
          </div>

          <!-- Right: Treatment Sidebar (2 cols on desktop) -->
          <div class="lg:col-span-2">
            <TreatmentSidebar
              :selected-teeth="selectedTeethList"
              :selected-surfaces="selectedSurfacesList"
              :selected-status="state.selectedStatus"
              :selected-treatment-types="selectedTreatmentIds"
              :treatments="availableTreatments"
              :treatment-disabled="treatmentSelectorDisabled"
              @surface-toggle="selectSurface"
              @status-change="selectStatus"
              @treatment-type-select="selectTreatment"
              @add-treatment="handleAddTreatment"
              @cancel="handleCancel"
            />
          </div>
        </div>

        <!-- Bottom: Treatment History (Full width) -->
        <div class="space-y-4">
          <h2 class="text-lg md:text-xl font-semibold text-gray-800">
            Эмчилгээний түүх
          </h2>

          <!-- Search Bar -->
          <HistorySearchBar
            :search-query="searchQuery"
            :status-filter="'all'"
            @search="handleSearch"
            @filter-status="handleFilterStatus"
          />

          <!-- History Table -->
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
    </div>
  </div>
</template>

<style scoped>
/* Mobile responsive adjustments */
@media (max-width: 1024px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>


