<script setup>
import { reactive, computed, ref } from 'vue'
import TopBar from '@/components/layout/TopBar.vue'
import SideNav from '@/components/layout/SideNav.vue'
import ToothChart from '@/components/tooth/ToothChart.vue'
import SurfaceSelector from '@/components/treatment/SurfaceSelector.vue'
import StatusSelector from '@/components/treatment/StatusSelector.vue'
import TreatmentTypeSelector from '@/components/treatment/TreatmentTypeSelector.vue'
import DiagnosisList from '@/components/treatment/DiagnosisList.vue'
import HistorySearchBar from '@/components/history/HistorySearchBar.vue'
import TreatmentHistoryTable from '@/components/history/TreatmentHistoryTable.vue'
import { treatmentTypes, getTreatmentById } from '@/data/treatmentTypes'
import { mockToothStatuses } from '@/data'
import { useToothStatus } from '@/composables/useToothStatus'
import { formatToothNumber } from '@/utils/toothHelpers'
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
const activePatient = ref(patientService.getDefaultPatient())
const isCollapsed = ref(false)
const isMobileNavOpen = ref(false)

const { toothStatuses, updateToothStatusFromTreatment } = useToothStatus(mockToothStatuses)

const selectedTeethList = computed(() => state.selectedTeeth)
const selectedSurfacesList = computed(() => state.selectedSurfaces)
const selectedTreatmentIds = computed(() => state.selectedTreatments)

const filteredToothTreatments = computed(() => treatmentTypes.filter((t) => t.toothRequired))
const filteredGeneralTreatments = computed(() => treatmentTypes.filter((t) => !t.toothRequired))

const availableTreatments = computed(() =>
  state.selectedTeeth.length ? filteredToothTreatments.value : filteredGeneralTreatments.value,
)

const surfaceDisabled = computed(() => state.selectedTeeth.length === 0)
const treatmentSelectorDisabled = computed(() => false)
const hasSelectedTeeth = computed(() => state.selectedTeeth.length > 0)
const canSubmit = computed(
  () => state.selectedTeeth.length > 0 && state.selectedSurfaces.length > 0 && state.selectedTreatments.length > 0,
)
const cancelDisabled = computed(() => state.selectedTeeth.length === 0)

const filteredLog = computed(() => {
  if (!searchQuery.value) return state.treatmentLog
  const q = searchQuery.value.toLowerCase()
  return state.treatmentLog.filter(
    (item) =>
      (item.treatmentType || '').toLowerCase().includes(q) || (item.diagnosis || '').toLowerCase().includes(q),
  )
})

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
}

function handleDeleteTreatment(treatmentId) {
  state.treatmentLog = state.treatmentLog.filter((t) => t.id !== treatmentId)
}

function toggleDiagnosis(code) {
  if (state.selectedDiagnoses.includes(code)) {
    state.selectedDiagnoses = state.selectedDiagnoses.filter((d) => d !== code)
  } else {
    state.selectedDiagnoses = [...state.selectedDiagnoses, code]
  }
}

function handlePatientSelected(patient) {
  activePatient.value = patient || activePatient.value
}

function toggleSidebar() {
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
  <div class="flex flex-col md:flex-row h-screen bg-gray-50 overflow-hidden">
    <div
      class="hidden md:block flex-shrink-0 bg-gray-900 transition-all duration-300"
      :class="isCollapsed ? 'w-20' : 'w-64'"
    >
      <SideNav :is-collapsed="isCollapsed" active-id="treatments" @toggle="toggleSidebar" @navigate="handleNavigate" />
    </div>

    <div class="flex-1 flex flex-col overflow-hidden relative">
      <div class="md:hidden flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-white">
        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="openMobileNav"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <p class="text-sm font-semibold text-gray-800">???</p>
      </div>

      <TopBar :active-patient="activePatient" @patient-selected="handlePatientSelected" />
      <div class="flex-1 overflow-y-auto bg-gray-100">
        <div class="p-2.5 md:p-3 space-y-2">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-1.5 md:gap-2.5 auto-rows-min items-start">
            <div class="order-1 md:col-span-2">
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

            <div class="order-4 md:order-2 md:col-span-1 md:row-span-2 md:max-w-[360px] md:ml-auto w-full">
              <div class="dental-card h-full flex flex-col p-2 md:p-2.5">
                <div class="pb-1.5 border-b border-gray-200">
                  <h2 class="text-base md:text-lg font-semibold text-gray-800">??????????? ???????</h2>
                  <div v-if="hasSelectedTeeth" class="mt-1">
                    <p class="text-sm font-medium text-gray-700">
                      ???????? ???: {{ selectedTeethList.length }}
                    </p>
                    <div class="flex flex-wrap gap-1 mt-0.5">
                      <span
                        v-for="tooth in selectedTeethList"
                        :key="tooth"
                        class="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded"
                      >
                        #{{ tooth }}
                      </span>
                    </div>
                  </div>
                  <p v-else class="text-sm text-amber-600 mt-0.5">??? ??????? ??.</p>
                </div>

                <div class="flex-1 overflow-y-auto pt-1.5 space-y-2 scrollbar-thin">
                 
                  <TreatmentTypeSelector
                    :selected-types="selectedTreatmentIds"
                    :disabled="treatmentSelectorDisabled"
                    :treatments="availableTreatments"
                    @toggle="selectTreatment"
                  />
                   <!-- <StatusSelector
                    :selected-status="state.selectedStatus"
                    :disabled="surfaceDisabled"
                    @change="selectStatus"
                  /> -->
                  <div v-if="!canSubmit" class="text-xs text-amber-600 space-y-1">
                    <p v-if="selectedTeethList.length === 0">??? ??????? ??.</p>
                    <p v-else-if="selectedSurfacesList.length === 0">???????? ??????? ??.</p>
                  </div>
                </div>

                <div class="pt-1.5 border-t border-gray-200 space-y-1">
                  <button
                    type="button"
                    :disabled="!canSubmit"
                    :class="[
                      'w-full btn-success transition-all duration-200 py-1.5',
                      !canSubmit ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:scale-102',
                    ]"
                    @click="handleAddTreatment"
                  >
                    <span v-if="selectedTeethList.length > 1">
                      ???????? ????? ({{ selectedTeethList.length }} ???)
                    </span>
                    <span v-else>
                      ???????? ?????
                    </span>
                  </button>
                  <button
                    type="button"
                    :disabled="cancelDisabled"
                    class="w-full btn-secondary transition-all duration-200 hover:shadow-md py-1.5"
                    @click="handleCancel"
                  >
                    ????????? ????????
                  </button>

                  <div v-if="selectedTeethList.length > 0 && !canSubmit" class="text-xs text-amber-600 mt-1 space-y-1">
                    <p v-if="selectedSurfacesList.length === 0">???????? ??????? ??.</p>
                    <p v-if="selectedTreatmentIds.length === 0">??????????? ????? ??????? ??.</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="order-2 md:order-3">
              <SurfaceSelector
                :selected-surfaces="selectedSurfacesList"
                :disabled="surfaceDisabled"
                @toggle="selectSurface"
              />
            </div>

            <div class="order-3 md:order-4">
              <div class="dental-card p-2 md:p-2.5">
                <DiagnosisList
                  :selected-diagnoses="state.selectedDiagnoses"
                  :disabled="surfaceDisabled"
                  @toggle="toggleDiagnosis"
                />
              </div>
            </div>
          </div>

          <div class="dental-card p-2.5 md:p-3 space-y-2 md:space-y-2.5">
            <h2 class="text-lg md:text-xl font-semibold text-gray-800">
              ??????????? ????
            </h2>

            <HistorySearchBar
              :search-query="searchQuery"
              :status-filter="'all'"
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
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="isMobileNavOpen"
        class="fixed inset-0 z-40 bg-black/50 md:hidden"
        @click="closeMobileNav"
      ></div>
    </transition>
    <transition name="slide">
      <div
        v-if="isMobileNavOpen"
        class="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 shadow-xl md:hidden"
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
        <SideNav :is-collapsed="false" active-id="treatments" @toggle="closeMobileNav" @navigate="handleNavigate" />
      </div>
    </transition>
  </div>
</template>
