<script setup>
import { reactive, computed, ref } from 'vue'
import TopBar from '@/components/clinic/TopBar.vue'
import SideNav from '@/components/layout/SideNav.vue'
import ToothChart from '@/components/tooth/ToothChart.vue'
import SurfaceSelector from '@/components/treatment/SurfaceSelector.vue'
import TreatmentTypeSelector from '@/components/treatment/TreatmentTypeSelector.vue'
import DiagnosisList from '@/components/treatment/DiagnosisList.vue'
import HistorySearchBar from '@/components/history/HistorySearchBar.vue'
import TreatmentHistoryTable from '@/components/history/TreatmentHistoryTable.vue'
import { treatmentTypes, getTreatmentById } from '@/data/treatmentTypes'
import { diagnoses, mockToothStatuses } from '@/data'
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

const hasSelectedTeeth = computed(() => selectedTeethList.value.length > 0)
const hasSelectedSurfaces = computed(() => selectedSurfacesList.value.length > 0)
const hasSelectedDiagnoses = computed(() => state.selectedDiagnoses.length > 0)
const hasSelectedTreatments = computed(() => selectedTreatmentIds.value.length > 0)

const filteredToothTreatments = computed(() => treatmentTypes.filter((t) => t.toothRequired))
const filteredGeneralTreatments = computed(() => treatmentTypes.filter((t) => !t.toothRequired))

const availableTreatments = computed(() =>
  hasSelectedTeeth.value ? filteredToothTreatments.value : filteredGeneralTreatments.value,
)

const selectedDiagnosisLabels = computed(() =>
  state.selectedDiagnoses.map((code) => {
    const match = diagnoses.find((d) => d.code === code)
    return match ? `${match.code} · ${match.name}` : code
  }),
)

const surfaceDisabled = computed(() => !hasSelectedTeeth.value)
const diagnosisDisabled = computed(() => !hasSelectedTeeth.value || !hasSelectedSurfaces.value)
const treatmentSelectorDisabled = computed(() => diagnosisDisabled.value || !hasSelectedDiagnoses.value)
const canSubmit = computed(
  () => hasSelectedTeeth.value && hasSelectedSurfaces.value && hasSelectedDiagnoses.value && hasSelectedTreatments.value,
)
const cancelDisabled = computed(() => !hasSelectedTeeth.value)

const stepperSteps = computed(() => [
  {
    id: 'tooth',
    label: 'Шүд',
    helper: hasSelectedTeeth.value ? `${selectedTeethList.value.length} сонгосон` : 'Шүд сонгоно уу',
    status: hasSelectedTeeth.value ? 'complete' : 'active',
  },
  {
    id: 'surface',
    label: 'Гадаргуу',
    helper: hasSelectedSurfaces.value ? selectedSurfacesList.value.join(', ') : 'Шүд сонгосны дараа',
    status: !hasSelectedTeeth.value ? 'disabled' : hasSelectedSurfaces.value ? 'complete' : 'active',
  },
  {
    id: 'diagnosis',
    label: 'Онош',
    helper: hasSelectedDiagnoses.value ? selectedDiagnosisLabels.value.join(', ') : 'Гадаргуу сонгоод оношлоно',
    status: diagnosisDisabled.value ? 'disabled' : hasSelectedDiagnoses.value ? 'complete' : 'active',
  },
  {
    id: 'treatment',
    label: 'Эмчилгээ',
    helper: hasSelectedTreatments.value ? `${selectedTreatmentIds.value.length} төрөл` : 'Онош сонгоод үргэлжлүүлнэ',
    status: treatmentSelectorDisabled.value ? 'disabled' : hasSelectedTreatments.value ? 'complete' : 'pending',
  },
  {
    id: 'review',
    label: 'Шалгах',
    helper: canSubmit.value ? 'Нэмэхэд бэлэн' : 'Алхам бүрийг бөглөнө үү',
    status: canSubmit.value ? 'complete' : 'pending',
  },
])

const filteredLog = computed(() => {
  if (!searchQuery.value) return state.treatmentLog
  const q = searchQuery.value.toLowerCase()
  return state.treatmentLog.filter(
    (item) =>
      (item.treatmentType || '').toLowerCase().includes(q) || (item.diagnosis || '').toLowerCase().includes(q),
  )
})

const selectionSummary = computed(() => ({
  teeth: hasSelectedTeeth.value ? selectedTeethList.value.map((tooth) => formatToothNumber(tooth)).join(', ') : '',
  surfaces: hasSelectedSurfaces.value ? selectedSurfacesList.value.join(', ') : '',
  diagnoses: hasSelectedDiagnoses.value ? selectedDiagnosisLabels.value.join(', ') : '',
}))

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
  if (!state.selectedSurfaces.length) {
    state.selectedDiagnoses = []
    state.selectedTreatments = []
  }
}

function selectTreatment(typeId) {
  if (treatmentSelectorDisabled.value) return
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
  if (!canSubmit.value) return
  const surfaceText = state.selectedSurfaces.join(', ')
  const diagnosisText = selectedDiagnosisLabels.value.join(', ') || 'Онош сонгоогүй'
  state.selectedTeeth.forEach((tooth) => {
    state.selectedTreatments.forEach((treatmentId) => {
      const treatment = getTreatmentById(treatmentId)
      const label = treatment?.label || treatmentId
      const entry = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        tooth: formatToothNumber(tooth),
        surface: surfaceText,
        diagnosis: diagnosisText,
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
  state.selectedDiagnoses = []
  state.selectedTreatments = []
}

function applyGeneralWorkflow(treatment) {
  if (treatmentSelectorDisabled.value) return
  const diagnosisText = selectedDiagnosisLabels.value.join(', ') || treatment.label
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
}

function handleAddTreatment() {
  applyToothWorkflow()
}

function handleCancel() {
  state.selectedSurfaces = []
  state.selectedDiagnoses = []
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
  if (diagnosisDisabled.value) return
  if (state.selectedDiagnoses.includes(code)) {
    state.selectedDiagnoses = state.selectedDiagnoses.filter((d) => d !== code)
  } else {
    state.selectedDiagnoses = [...state.selectedDiagnoses, code]
  }
  if (!state.selectedDiagnoses.length) {
    state.selectedTreatments = []
  }
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
    <!-- <div
      class="hidden md:block flex-shrink-0 bg-gray-900 transition-all duration-300"
      :class="isCollapsed ? 'w-20' : 'w-64'"
    >
      <SideNav :is-collapsed="isCollapsed" active-id="treatments" @toggle="toggleSidebar" @navigate="handleNavigate" />
    </div> -->
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

      <TopBar :breadcrumbs="breadcrumbs" card-id="2511002" placeholder="Өвчтөн хайх (Нэр, РД, Утас...)" />
      <main class="flex-1 overflow-y-auto bg-gray-100">
        <div class="p-4 md:p-6 space-y-4">
          <!-- <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-4 md:p-5 space-y-3">
            <div class="flex items-center justify-between">
              <h1 class="text-lg md:text-xl font-semibold text-gray-900">Эмчилгээний алхам</h1>
              <p class="text-xs text-slate-500">1–5 алхам</p>
            </div>
            <div class="flex flex-wrap items-center gap-3 md:gap-4">
              <div
                v-for="(step, index) in stepperSteps"
                :key="step.id"
                class="flex items-center gap-3 min-w-[140px] flex-1"
              >
                <div
                  :class="[
                    'flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold border-2 transition-colors duration-200',
                    step.status === 'complete' ? 'bg-blue-600 text-white border-blue-600' : '',
                    step.status === 'active' ? 'bg-blue-50 text-blue-700 border-blue-300' : '',
                    step.status === 'pending' ? 'bg-white text-gray-600 border-gray-300' : '',
                    step.status === 'disabled' ? 'bg-gray-100 text-gray-400 border-gray-200' : '',
                  ]"
                >
                  <svg v-if="step.status === 'complete'" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span v-else>{{ index + 1 }}</span>
                </div>
                <div class="min-w-0">
                  <p
                    :class="[
                      'text-sm font-semibold truncate',
                      step.status === 'disabled' ? 'text-gray-400' : 'text-gray-900',
                    ]"
                  >
                    {{ step.label }}
                  </p>
                  <p class="text-xs text-slate-500 truncate">{{ step.helper }}</p>
                </div>
                <div
                  v-if="index < stepperSteps.length - 1"
                  class="hidden md:block flex-1 h-px border-t border-dashed"
                  :class="step.status === 'complete' ? 'border-blue-300' : 'border-slate-200'"
                ></div>
              </div>
            </div>
          </div> -->

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

              <div class="grid gap-4 md:grid-cols-2">
                <SurfaceSelector
                  :selected-surfaces="selectedSurfacesList"
                  :disabled="surfaceDisabled"
                  @toggle="selectSurface"
                />

                <div class="dental-card p-4 space-y-3">
                  <DiagnosisList
                    :selected-diagnoses="state.selectedDiagnoses"
                    :disabled="diagnosisDisabled"
                    @toggle="toggleDiagnosis"
                  />
                  <p v-if="diagnosisDisabled" class="text-xs text-slate-500">
                    Шүд болон гадаргуугаа сонгоод оношоо тэмдэглэнэ үү.
                  </p>
                </div>
              </div>
            </div>

            <div class="lg:col-span-4 lg:pl-1">
              <div class="dental-card sticky top-4 flex flex-col gap-4 p-4 max-h-[calc(100vh-120px)]">
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <h2 class="text-base md:text-lg font-semibold text-gray-900">Сонголтын хураангуй</h2>
                    <span class="text-xs text-slate-500">Алхам 4</span>
                  </div>
                  <!-- <div class="space-y-2 text-sm">
                    <div class="flex items-start gap-2">
                      <div class="mt-0.5 h-2 w-2 rounded-full bg-blue-500"></div>
                      <div>
                        <p class="text-xs uppercase tracking-wide text-slate-500">Шүд</p>
                        <div v-if="selectionSummary.teeth" class="flex flex-wrap gap-1">
                          <span
                            v-for="tooth in selectedTeethList"
                            :key="tooth"
                            class="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold"
                          >
                            #{{ formatToothNumber(tooth) }}
                          </span>
                        </div>
                        <p v-else class="text-slate-500">Сонгоогүй байна</p>
                      </div>
                    </div>
                    <div class="flex items-start gap-2">
                      <div class="mt-0.5 h-2 w-2 rounded-full bg-emerald-500"></div>
                      <div>
                        <p class="text-xs uppercase tracking-wide text-slate-500">Гадаргуу</p>
                        <p v-if="selectionSummary.surfaces" class="text-gray-900 font-medium">
                          {{ selectionSummary.surfaces }}
                        </p>
                        <p v-else class="text-slate-500">Гадаргуу сонгоогүй</p>
                      </div>
                    </div>
                    <div class="flex items-start gap-2">
                      <div class="mt-0.5 h-2 w-2 rounded-full bg-indigo-500"></div>
                      <div>
                        <p class="text-xs uppercase tracking-wide text-slate-500">Онош</p>
                        <p v-if="selectionSummary.diagnoses" class="text-gray-900 font-medium">
                          {{ selectionSummary.diagnoses }}
                        </p>
                        <p v-else class="text-slate-500">Онош тэмдэглээгүй</p>
                      </div>
                    </div>
                  </div> -->
                </div>

                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <h3 class="text-sm font-semibold text-gray-900">Эмчилгээний төрөл</h3>
                    <span class="text-xs text-slate-500">Шүүлтүүр + хайлт</span>
                  </div>
                  <TreatmentTypeSelector
                    :selected-types="selectedTreatmentIds"
                    :disabled="treatmentSelectorDisabled"
                    :treatments="availableTreatments"
                    @toggle="selectTreatment"
                  />
                  <p v-if="treatmentSelectorDisabled" class="text-xs text-slate-500">
                    Онош сонгосны дараа эмчилгээний төрлөө сонгоно уу.
                  </p>
                </div>

                <div class="border-t border-gray-200 pt-3 space-y-2">
                  <button
                    type="button"
                    :disabled="!canSubmit"
                    class="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 hover:bg-blue-700 hover:shadow-md"
                    @click="handleAddTreatment"
                  >
                    <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fill-rule="evenodd"
                        d="M10 4a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V5a1 1 0 011-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    Эмчилгээ нэмэх
                  </button>
                  <button
                    type="button"
                    :disabled="cancelDisabled"
                    class="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                    @click="handleCancel"
                  >
                    Сонголт цэвэрлэх
                  </button>
                  <div v-if="!canSubmit" class="text-xs text-amber-600 space-y-1">
                    <p v-if="!hasSelectedTeeth">Шүдээ сонгоно уу.</p>
                    <p v-else-if="!hasSelectedSurfaces">Гадаргууг заавал сонгоно уу.</p>
                    <p v-else-if="!hasSelectedDiagnoses">Онош сонгосны дараа үргэлжилнэ.</p>
                    <p v-else-if="!hasSelectedTreatments">Эмчилгээний төрөл сонгоно уу.</p>
                  </div>
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
      </main>
    </div>

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
