<script setup>
import { computed } from 'vue'
import SideNav from '@/components/layout/SideNav.vue'
import PatientHeader from '@/components/patient/PatientHeader.vue'
import ToothChart from '@/components/tooth/ToothChart.vue'
import TreatmentSidebar from '@/components/treatment/TreatmentSidebar.vue'
import HistorySearchBar from '@/components/history/HistorySearchBar.vue'
import TreatmentHistoryTable from '@/components/history/TreatmentHistoryTable.vue'

// Composables
import { useTreatmentState } from '@/composables/useTreatmentState'
import { useToothStatus } from '@/composables/useToothStatus'
import { useTreatmentHistory } from '@/composables/useTreatmentHistory'

// Data
import { mockPatient, mockTreatmentHistory, mockToothStatuses } from '@/data'
import { getTreatmentById } from '@/data/treatmentTypes'
import { formatToothNumber } from '@/utils/toothHelpers'

// Initialize composables
const {
  selectedTeeth,
  selectedSurfaces,
  selectedStatus,
  selectedTreatmentType,
  isFormValid,
  surfacesString,
  teethString,
  selectTeeth,
  toggleSurface,
  setStatus,
  selectTreatmentType,
  resetForm,
  resetSelection,
} = useTreatmentState()

const {
  toothStatuses,
  updateToothStatusFromTreatment,
  updateStatusesFromHistory,
} = useToothStatus(mockToothStatuses)

const {
  treatments,
  searchQuery,
  filteredTreatments,
  treatmentStats,
  addTreatment,
  deleteTreatment,
  setSearchQuery,
  setFilter,
} = useTreatmentHistory(mockTreatmentHistory)

// Initialize tooth statuses from history
updateStatusesFromHistory(mockTreatmentHistory)

// Patient stats
const patientStats = computed(() => ({
  totalTreatments: treatmentStats.value.total,
  completedTreatments: treatmentStats.value.completed,
  plannedTreatments: treatmentStats.value.planned,
}))

// Event Handlers

// Teeth selection (multi-select)
function handleTeethSelect(teeth) {
  selectTeeth(teeth)
}

// Select all teeth
function handleSelectAll(teeth) {
  selectTeeth(teeth)
}

// Clear selection
function handleClearSelection() {
  resetForm()
}

// Surface toggle
function handleSurfaceToggle(surface) {
  toggleSurface(surface)
}

// Status change
function handleStatusChange(status) {
  setStatus(status)
}

// Treatment type selection
function handleTreatmentTypeSelect(typeId) {
  selectTreatmentType(typeId)
}

// Add treatment
function handleAddTreatment() {
  if (!isFormValid.value) return

  // Get treatment type label
  const treatmentType = getTreatmentById(selectedTreatmentType.value)
  const treatmentLabel = treatmentType ? treatmentType.label : selectedTreatmentType.value

  // Add treatment for each selected tooth
  selectedTeeth.value.forEach((toothNum) => {
    const newTreatment = {
      tooth: formatToothNumber(toothNum),
      surface: surfacesString.value,
      diagnosis: treatmentLabel, // Use treatment label as diagnosis
      treatmentType: treatmentLabel,
      doctor: 'Б. Болд',
      price: treatmentType?.price || '0₮',
      status: selectedStatus.value,
      notes: '',
    }

    const added = addTreatment(newTreatment)
    updateToothStatusFromTreatment(added)
  })

  // Reset form but keep teeth selected
  resetSelection()
}

// Cancel selection
function handleCancel() {
  resetForm()
}

// Search treatments
function handleSearch(query) {
  setSearchQuery(query)
}

// Filter by status
function handleFilterStatus(status) {
  setFilter('status', status)
}

// Edit treatment
function handleEditTreatment(treatmentId) {
  console.log('Edit treatment:', treatmentId)
}

// Delete treatment
function handleDeleteTreatment(treatmentId) {
  if (confirm('Эмчилгээг устгах уу?')) {
    deleteTreatment(treatmentId)
    updateStatusesFromHistory(treatments.value)
  }
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
              :selected-teeth="selectedTeeth"
              :tooth-statuses="toothStatuses"
              :multi-select="true"
              @teeth-select="handleTeethSelect"
              @select-all="handleSelectAll"
              @clear-selection="handleClearSelection"
            />
          </div>

          <!-- Right: Treatment Sidebar (2 cols on desktop) -->
          <div class="lg:col-span-2">
            <TreatmentSidebar
              :selected-teeth="selectedTeeth"
              :selected-surfaces="selectedSurfaces"
              :selected-status="selectedStatus"
              :selected-treatment-type="selectedTreatmentType"
              @surface-toggle="handleSurfaceToggle"
              @status-change="handleStatusChange"
              @treatment-type-select="handleTreatmentTypeSelect"
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
              :treatments="filteredTreatments"
              :loading="false"
              @edit="handleEditTreatment"
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
