<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  selectedTeeth: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:surfaces', 'update:diagnosis', 'update:treatmentTypes', 'confirm'])

const step = ref(1)
const selectedSurfaces = ref([])
const selectedDiagnosis = ref(null)
const diagnosisQuery = ref('')
const diagnosisOpen = ref(false)
const treatmentTypeQuery = ref('')
const selectedTreatmentTypes = ref([])

const diagnosisOptions = [
  { code: 'DX-01', name: 'Caries incipient' },
  { code: 'DX-02', name: 'Pulpitis' },
  { code: 'DX-03', name: 'Gingivitis' },
  { code: 'DX-04', name: 'Periodontitis' },
  { code: 'DX-05', name: 'Hypersensitivity' },
  { code: 'DX-06', name: 'Fracture risk' },
]

const treatmentTypeOptions = [
  { id: 'exam', label: 'Exam' },
  { id: 'xray', label: 'X-Ray' },
  { id: 'prophy-fl', label: 'Prophy/Fl' },
  { id: 'period-srp', label: 'Period/SRP' },
  { id: 'composite', label: 'Composite' },
  { id: 'amalgam', label: 'Amalgam' },
  { id: 'crown', label: 'Crowns' },
  { id: 'build-up', label: 'Build up/ Pins' },
  { id: 'extraction', label: 'Extraction' },
  { id: 'bridge-abutment', label: 'Bridge Abutment' },
  { id: 'bridge-pontic', label: 'Bridge Pontic' },
  { id: 'inlay-onlay', label: 'Inlay Onlay' },
  { id: 'root-canal', label: 'Root Canal' },
  { id: 'pulpotomy', label: 'Pulp Procedure' },
  { id: 'denture', label: 'Denture' },
  { id: 'partial-denture', label: 'Partial Denture' },
]

const surfacesDisabled = computed(() => props.selectedTeeth.length === 0)
const stepTitle = computed(() => (step.value === 1 ? 'ГАДАРГУУ СОНГОХ' : 'ЭМЧИЛГЭЭ СОНГОХ'))
const canGoNext = computed(() => selectedSurfaces.value.length > 0)
const showSkip = computed(() => selectedSurfaces.value.length === 0)
const filteredDiagnoses = computed(() => {
  const query = diagnosisQuery.value.trim().toLowerCase()
  if (!query) return diagnosisOptions
  return diagnosisOptions.filter(
    (item) => item.name.toLowerCase().includes(query) || item.code.toLowerCase().includes(query),
  )
})
const filteredTreatmentTypes = computed(() => {
  const query = treatmentTypeQuery.value.trim().toLowerCase()
  if (!query) return treatmentTypeOptions
  return treatmentTypeOptions.filter((item) => item.label.toLowerCase().includes(query))
})

const canConfirm = computed(() => selectedTreatmentTypes.value.length > 0)

function toggleSurface(surfaceId) {
  if (surfacesDisabled.value) return
  if (selectedSurfaces.value.includes(surfaceId)) {
    selectedSurfaces.value = selectedSurfaces.value.filter((s) => s !== surfaceId)
  } else {
    selectedSurfaces.value = [...selectedSurfaces.value, surfaceId]
  }
  emit('update:surfaces', selectedSurfaces.value)
}

function selectDiagnosis(option) {
  selectedDiagnosis.value = option
  diagnosisQuery.value = option?.name || ''
  diagnosisOpen.value = false
  emit('update:diagnosis', selectedDiagnosis.value)
}

function clearDiagnosis() {
  selectedDiagnosis.value = null
  diagnosisQuery.value = ''
  emit('update:diagnosis', null)
}

function closeDiagnosisDropdown() {
  setTimeout(() => {
    diagnosisOpen.value = false
  }, 100)
}

function goNext() {
  if (canGoNext.value) {
    step.value = 2
  }
}

function skipSurfaces() {
  selectedSurfaces.value = []
  emit('update:surfaces', [])
  step.value = 2
}

function goBack() {
  step.value = 1
}

function toggleTreatment(typeId) {
  if (selectedTreatmentTypes.value.includes(typeId)) {
    selectedTreatmentTypes.value = selectedTreatmentTypes.value.filter((id) => id !== typeId)
  } else {
    selectedTreatmentTypes.value = [...selectedTreatmentTypes.value, typeId]
  }
  emit('update:treatmentTypes', selectedTreatmentTypes.value)
}

function handleConfirm() {
  if (!canConfirm.value) return
  emit('confirm', {
    surfaces: selectedSurfaces.value,
    diagnosis: selectedDiagnosis.value,
    treatmentTypes: selectedTreatmentTypes.value,
  })
}

watch(
  () => props.selectedTeeth.length,
  (count) => {
    if (count === 0) {
      selectedSurfaces.value = []
      emit('update:surfaces', [])
    }
  },
)
</script>

<template>
  <section class="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 max-w-[420px] w-full">
    <div class="flex items-start justify-between">
      <div class="space-y-1">
        <p class="text-[11px] font-semibold tracking-[0.08em] text-slate-400">{{ stepTitle }}</p>
        <p class="text-sm text-slate-500">Сонгосон шүд: {{ selectedTeeth.length || 0 }}</p>
      </div>
      <span class="text-xs font-semibold text-slate-500">{{ step }}/2</span>
    </div>

    <div v-if="step === 1" class="mt-5 space-y-6">
      <div class="flex flex-col items-center gap-3">
        <div class="grid grid-cols-3 gap-2">
          <div></div>
          <button
            type="button"
            :class="[
              'h-11 w-14 rounded-xl border text-xs font-semibold transition',
              selectedSurfaces.includes('B')
                ? 'border-blue-400 bg-blue-50 text-blue-700'
                : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700',
              surfacesDisabled ? 'opacity-60 cursor-not-allowed' : '',
            ]"
            :disabled="surfacesDisabled"
            @click="toggleSurface('B')"
          >
            B/F
          </button>
          <div></div>

          <button
            type="button"
            :class="[
              'h-11 w-14 rounded-xl border text-xs font-semibold transition',
              selectedSurfaces.includes('M')
                ? 'border-blue-400 bg-blue-50 text-blue-700'
                : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700',
              surfacesDisabled ? 'opacity-60 cursor-not-allowed' : '',
            ]"
            :disabled="surfacesDisabled"
            @click="toggleSurface('M')"
          >
            M
          </button>
          <button
            type="button"
            :class="[
              'h-11 w-14 rounded-xl border text-xs font-semibold transition',
              selectedSurfaces.includes('O')
                ? 'border-blue-400 bg-blue-50 text-blue-700'
                : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700',
              surfacesDisabled ? 'opacity-60 cursor-not-allowed' : '',
            ]"
            :disabled="surfacesDisabled"
            @click="toggleSurface('O')"
          >
            O/I
          </button>
          <button
            type="button"
            :class="[
              'h-11 w-14 rounded-xl border text-xs font-semibold transition',
              selectedSurfaces.includes('D')
                ? 'border-blue-400 bg-blue-50 text-blue-700'
                : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700',
              surfacesDisabled ? 'opacity-60 cursor-not-allowed' : '',
            ]"
            :disabled="surfacesDisabled"
            @click="toggleSurface('D')"
          >
            D
          </button>

          <div></div>
          <button
            type="button"
            :class="[
              'h-11 w-14 rounded-xl border text-xs font-semibold transition',
              selectedSurfaces.includes('L')
                ? 'border-blue-400 bg-blue-50 text-blue-700'
                : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700',
              surfacesDisabled ? 'opacity-60 cursor-not-allowed' : '',
            ]"
            :disabled="surfacesDisabled"
            @click="toggleSurface('L')"
          >
            L/P
          </button>
          <div></div>
        </div>
        <p class="text-xs text-slate-500">Гадаргуу сонгон уу.</p>
      </div>

      <div class="space-y-2">
        <p class="text-[11px] font-semibold tracking-[0.08em] text-slate-400">ЭМЧИЛГЭЭНИЙ ОНОШ</p>
        <div class="relative">
          <input
            v-model="diagnosisQuery"
            type="text"
            placeholder="ХАЙХ"
            class="w-full h-10 rounded-full border border-slate-200 px-4 pr-10 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
            @focus="diagnosisOpen = true"
            @input="diagnosisOpen = true"
            @blur="closeDiagnosisDropdown"
          />
          <button
            type="button"
            class="absolute inset-y-0 right-2 flex items-center px-2 text-slate-400"
            @mousedown.prevent
            @click="diagnosisOpen = !diagnosisOpen"
          >
            <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m6 8 4 4 4-4" />
            </svg>
          </button>
          <div
            v-if="diagnosisOpen"
            class="absolute z-10 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <ul class="max-h-44 overflow-y-auto py-2 text-sm text-slate-700">
              <li>
                <button
                  type="button"
                  class="w-full px-4 py-2 text-left hover:bg-slate-50"
                  @mousedown.prevent
                  @click="clearDiagnosis"
                >
                  Алгасах
                </button>
              </li>
              <li v-for="item in filteredDiagnoses" :key="item.code">
                <button
                  type="button"
                  class="flex w-full items-center justify-between px-4 py-2 text-left hover:bg-slate-50"
                  @mousedown.prevent
                  @click="selectDiagnosis(item)"
                >
                  <span>{{ item.name }}</span>
                  <span class="text-xs text-slate-400">{{ item.code }}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between pt-1">
        <button
          v-if="showSkip"
          type="button"
          class="text-sm font-semibold text-slate-500 hover:text-blue-600"
          @click="skipSurfaces"
        >
          Алгасах
        </button>
        <div class="flex-1"></div>
        <button
          type="button"
          class="min-h-[40px] rounded-full border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="!canGoNext"
          @click="goNext"
        >
          Эмчилгээ сонгох
        </button>
      </div>
    </div>

    <div v-else class="mt-4 space-y-4">
      <div class="flex items-center justify-between gap-3">
        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-700"
          @click="goBack"
        >
          <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m11 6-4 4 4 4" />
          </svg>
        </button>
        <div class="flex-1">
          <input
            v-model="treatmentTypeQuery"
            type="text"
            placeholder="эмчилгээний төрлөөр хайна"
            class="w-full h-10 rounded-full border border-slate-200 px-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="!canConfirm"
          @click="handleConfirm"
        >
          <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m9 6 4 4-4 4" />
          </svg>
        </button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <button
          v-for="item in filteredTreatmentTypes"
          :key="item.id"
          type="button"
          :class="[
            'flex min-h-[44px] items-center justify-center rounded-xl border px-2 text-sm text-slate-700 text-center transition hover:border-blue-400 hover:text-blue-700',
            selectedTreatmentTypes.includes(item.id)
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-slate-200 bg-white',
          ]"
          @click="toggleTreatment(item.id)"
        >
          <span class="leading-tight">{{ item.label }}</span>
        </button>
      </div>
    </div>
  </section>
</template>
