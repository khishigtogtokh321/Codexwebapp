<script setup>
import { computed, ref, watch } from 'vue'
import diagnoses from '@/data/diagnoses'

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
const showDiagnosisDropdown = ref(false)
const treatmentTypeQuery = ref('')
const selectedTreatmentTypes = ref([])

const mockDiagnoses = diagnoses.slice(0, 6)

const treatmentTypeOptions = [
  { id: 'exam', label: 'Exam', value: 'exam' },
  { id: 'x-ray', label: 'X-Ray', value: 'xray' },
  { id: 'prophy-fl', label: 'Prophy/Fl', value: 'cleaning' },
  { id: 'period-srp', label: 'Period/SRP', value: 'deep-cleaning' },
  { id: 'composite', label: 'Composite', value: 'composite' },
  { id: 'amalgam', label: 'Amalgam', value: 'amalgam' },
  { id: 'crowns', label: 'Crowns', value: 'crown' },
  { id: 'build-up', label: 'Build up/ Pins', value: 'base' },
  { id: 'extraction', label: 'Extraction', value: 'extraction' },
  { id: 'bridge-abutment', label: 'Bridge Abutment', value: 'bridge' },
  { id: 'bridge-pontic', label: 'Bridge Pontic', value: 'bridge' },
  { id: 'inlay-onlay', label: 'Inlay Onlay', value: 'inlay' },
  { id: 'root-canal', label: 'Root Canal', value: 'root-canal' },
  { id: 'pulp-procedure', label: 'Pulp Procedure', value: 'pulpotomy' },
  { id: 'denture', label: 'Denture', value: 'denture' },
  { id: 'partial-denture', label: 'Partial Denture', value: 'partial-denture' },
]

const hasSelectedTeeth = computed(() => props.selectedTeeth?.length > 0)

const filteredDiagnoses = computed(() => {
  if (!diagnosisQuery.value) return mockDiagnoses
  const query = diagnosisQuery.value.toLowerCase()
  return mockDiagnoses.filter(
    (item) => item.code.toLowerCase().includes(query) || item.name.toLowerCase().includes(query),
  )
})

const filteredTreatmentTypes = computed(() => {
  if (!treatmentTypeQuery.value) return treatmentTypeOptions
  const query = treatmentTypeQuery.value.toLowerCase()
  return treatmentTypeOptions.filter((item) => item.label.toLowerCase().includes(query))
})

const selectedTreatmentValues = computed(() =>
  selectedTreatmentTypes.value
    .map((id) => treatmentTypeOptions.find((item) => item.id === id)?.value)
    .filter(Boolean),
)

const canProceed = computed(() => selectedSurfaces.value.length > 0)
const canConfirm = computed(() => selectedTreatmentTypes.value.length > 0)

watch(
  () => props.selectedTeeth,
  (teeth) => {
    if (!teeth?.length) {
      selectedSurfaces.value = []
      selectedDiagnosis.value = null
      selectedTreatmentTypes.value = []
      diagnosisQuery.value = ''
      treatmentTypeQuery.value = ''
      step.value = 1
    }
  },
)

watch(
  () => selectedSurfaces.value,
  (surfaces) => {
    emit('update:surfaces', surfaces)
  },
  { deep: true },
)

watch(
  () => selectedDiagnosis.value,
  (diagnosis) => {
    emit('update:diagnosis', diagnosis)
  },
  { deep: true },
)

watch(
  () => selectedTreatmentValues.value,
  (types) => {
    emit('update:treatmentTypes', types)
  },
  { deep: true },
)

function toggleSurface(id) {
  if (!hasSelectedTeeth.value) return
  if (selectedSurfaces.value.includes(id)) {
    selectedSurfaces.value = selectedSurfaces.value.filter((s) => s !== id)
  } else {
    selectedSurfaces.value = [...selectedSurfaces.value, id]
  }
}

function selectDiagnosis(item) {
  selectedDiagnosis.value = item
  showDiagnosisDropdown.value = false
}

function clearDiagnosis() {
  selectedDiagnosis.value = null
  showDiagnosisDropdown.value = false
}

function goNext() {
  if (canProceed.value) {
    step.value = 2
  }
}

function skipSurfaces() {
  selectedSurfaces.value = []
  step.value = 2
}

function goBack() {
  step.value = 1
}

function toggleTreatment(id) {
  if (selectedTreatmentTypes.value.includes(id)) {
    selectedTreatmentTypes.value = selectedTreatmentTypes.value.filter((item) => item !== id)
  } else {
    selectedTreatmentTypes.value = [...selectedTreatmentTypes.value, id]
  }
}

function handleConfirm() {
  if (!canConfirm.value) return
  emit('confirm', {
    surfaces: selectedSurfaces.value,
    diagnosis: selectedDiagnosis.value,
    treatmentTypes: selectedTreatmentValues.value,
  })
}
</script>

<template>
  <section class="w-full max-w-[420px] bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
    <div class="flex items-start justify-between mb-4">
      <p class="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
        {{ step === 1 ? 'Гадаргуу сонгох' : 'Эмчилгээ сонгох' }}
      </p>
      <p class="text-xs font-semibold text-slate-400">{{ step }}/2</p>
    </div>

    <div v-if="step === 1" class="space-y-6">
      <div class="flex flex-col items-center gap-4">
        <div class="grid grid-cols-3 gap-2 justify-items-center w-full max-w-[220px]">
          <div></div>
          <button
            type="button"
            class="w-14 h-14 rounded-xl border text-sm font-semibold transition bg-white text-slate-500 border-slate-200 hover:bg-slate-50 disabled:opacity-50"
            :class="selectedSurfaces.includes('B/F') ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : ''"
            :disabled="!hasSelectedTeeth"
            @click="toggleSurface('B/F')"
          >
            B/F
          </button>
          <div></div>

          <button
            type="button"
            class="w-14 h-14 rounded-xl border text-sm font-semibold transition bg-white text-slate-500 border-slate-200 hover:bg-slate-50 disabled:opacity-50"
            :class="selectedSurfaces.includes('M') ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : ''"
            :disabled="!hasSelectedTeeth"
            @click="toggleSurface('M')"
          >
            M
          </button>

          <button
            type="button"
            class="w-14 h-14 rounded-xl border text-sm font-semibold transition bg-white text-slate-500 border-slate-200 hover:bg-slate-50 disabled:opacity-50"
            :class="selectedSurfaces.includes('O/I') ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : ''"
            :disabled="!hasSelectedTeeth"
            @click="toggleSurface('O/I')"
          >
            O/I
          </button>

          <button
            type="button"
            class="w-14 h-14 rounded-xl border text-sm font-semibold transition bg-white text-slate-500 border-slate-200 hover:bg-slate-50 disabled:opacity-50"
            :class="selectedSurfaces.includes('D') ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : ''"
            :disabled="!hasSelectedTeeth"
            @click="toggleSurface('D')"
          >
            D
          </button>

          <div></div>
          <button
            type="button"
            class="w-14 h-14 rounded-xl border text-sm font-semibold transition bg-white text-slate-500 border-slate-200 hover:bg-slate-50 disabled:opacity-50"
            :class="selectedSurfaces.includes('L/P') ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : ''"
            :disabled="!hasSelectedTeeth"
            @click="toggleSurface('L/P')"
          >
            L/P
          </button>
          <div></div>
        </div>
        <p v-if="!hasSelectedTeeth" class="text-xs text-slate-400">Эхлээд шүд сонгоно уу.</p>
      </div>

      <div class="space-y-2">
        <p class="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Эмчилгээний онош</p>
        <div class="relative">
          <div
            class="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 bg-white cursor-text"
            @click="showDiagnosisDropdown = !showDiagnosisDropdown"
          >
            <input
              v-model="diagnosisQuery"
              type="text"
              placeholder="ХАЙХ"
              class="w-full bg-transparent text-sm text-slate-700 focus:outline-none"
              @focus="showDiagnosisDropdown = true"
            />
            <svg class="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd" />
            </svg>
          </div>
          <div
            v-if="showDiagnosisDropdown"
            class="absolute z-10 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-md overflow-hidden"
          >
            <button
              type="button"
              class="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
              @click.stop="clearDiagnosis"
            >
              Алгасах
            </button>
            <div class="max-h-48 overflow-y-auto divide-y divide-slate-100">
              <button
                v-for="item in filteredDiagnoses"
                :key="item.code"
                type="button"
                class="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                @click.stop="selectDiagnosis(item)"
              >
                <p class="font-semibold">{{ item.code }}</p>
                <p class="text-xs text-slate-500">{{ item.name }}</p>
              </button>
            </div>
          </div>
          <p v-if="selectedDiagnosis" class="mt-2 text-xs text-emerald-700">{{ selectedDiagnosis.code }} · {{ selectedDiagnosis.name }}</p>
        </div>
      </div>

      <div class="flex items-center justify-between gap-2">
        <button
          type="button"
          class="min-h-[42px] px-4 py-2 rounded-full border border-slate-200 text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="!canProceed"
          @click="goNext"
        >
          Эмчилгээ сонгох
        </button>
        <button
          v-if="!canProceed"
          type="button"
          class="text-xs font-medium text-slate-500 hover:text-slate-700"
          @click="skipSurfaces"
        >
          Алгасах
        </button>
      </div>
    </div>

    <div v-else class="space-y-4">
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="h-9 w-9 inline-flex items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
          @click="goBack"
        >
          <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M12.78 4.22a.75.75 0 010 1.06L8.06 10l4.72 4.72a.75.75 0 11-1.06 1.06l-5.25-5.25a.75.75 0 010-1.06l5.25-5.25a.75.75 0 011.06 0z" clip-rule="evenodd" />
          </svg>
        </button>
        <div class="flex-1">
          <div class="flex items-center rounded-full border border-slate-200 bg-white px-3 py-2">
            <svg class="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 103.473 9.8l2.613 2.614a.75.75 0 101.06-1.06l-2.613-2.615A5.5 5.5 0 009 3.5zm-4 5.5a4 4 0 118 0 4 4 0 01-8 0z" clip-rule="evenodd" />
            </svg>
            <input
              v-model="treatmentTypeQuery"
              type="text"
              class="w-full bg-transparent text-sm text-slate-700 focus:outline-none px-2"
              placeholder="эмчилгээний төрлөөр хайна"
            />
          </div>
        </div>
        <button
          type="button"
          class="h-9 w-9 inline-flex items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-60"
          :disabled="!canConfirm"
          @click="handleConfirm"
        >
          <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M7.22 4.22a.75.75 0 011.06 0l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 11-1.06-1.06L11.94 10 7.22 5.28a.75.75 0 010-1.06z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        <button
          v-for="item in filteredTreatmentTypes"
          :key="item.id"
          type="button"
          class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          :class="selectedTreatmentTypes.includes(item.id) ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : ''"
          @click="toggleTreatment(item.id)"
        >
          {{ item.label }}
        </button>
      </div>
    </div>
  </section>
</template>
