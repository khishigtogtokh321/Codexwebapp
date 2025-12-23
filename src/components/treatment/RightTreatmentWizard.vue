<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  selectedTeeth: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:surfaces', 'update:diagnosis', 'update:typeId', 'update:code'])

const treatmentTypes = [
  { id: 'exam', label: 'Exam', surfaceRequired: false },
  { id: 'xray', label: 'X-Ray', surfaceRequired: false },
  { id: 'prophy', label: 'Prophy/Fl', surfaceRequired: true },
  { id: 'perio', label: 'Period/SRP', surfaceRequired: true },
  { id: 'composite', label: 'Composite', surfaceRequired: true },
  { id: 'amalgam', label: 'Amalgam', surfaceRequired: true },
  { id: 'crown', label: 'Crowns', surfaceRequired: true },
  { id: 'build', label: 'Build up/ Pins', surfaceRequired: true },
  { id: 'extraction', label: 'Extraction', surfaceRequired: true },
  { id: 'abutment', label: 'Bridge Abutment', surfaceRequired: true },
  { id: 'pontic', label: 'Bridge Pontic', surfaceRequired: true },
  { id: 'inlay', label: 'Inlay Onlay', surfaceRequired: true },
  { id: 'rct', label: 'Root Canal', surfaceRequired: true },
  { id: 'pulp', label: 'Pulp Procedure', surfaceRequired: true },
  { id: 'denture', label: 'Denture', surfaceRequired: true },
  { id: 'partial', label: 'Partial Denture', surfaceRequired: true },
]

const treatmentCodesByType = {
  exam: [
    { code: 'D0120', name: 'Periodic oral evaluation' },
    { code: 'D0150', name: 'Comprehensive exam' },
  ],
  xray: [
    { code: 'D0210', name: 'Intraoral complete series' },
    { code: 'D0220', name: 'Periapical first film' },
  ],
  prophy: [
    { code: 'D1110', name: 'Adult prophylaxis' },
    { code: 'D1206', name: 'Topical fluoride' },
  ],
  perio: [
    { code: 'D4341', name: 'Periodontal SRP 4+ teeth' },
    { code: 'D4910', name: 'Perio maintenance' },
  ],
  composite: [
    { code: 'D2391', name: 'Resin-based 1 surface' },
    { code: 'D2392', name: 'Resin-based 2 surfaces' },
  ],
  amalgam: [
    { code: 'D2140', name: 'Amalgam 1 surface' },
    { code: 'D2150', name: 'Amalgam 2 surfaces' },
  ],
  crown: [
    { code: 'D2750', name: 'Porcelain fused to high noble' },
    { code: 'D2950', name: 'Core buildup' },
  ],
  build: [
    { code: 'D2950', name: 'Core buildup with pins' },
    { code: 'D2954', name: 'Prefabricated post and core' },
  ],
  extraction: [
    { code: 'D7140', name: 'Extraction erupted tooth' },
    { code: 'D7210', name: 'Surgical removal erupted tooth' },
  ],
  abutment: [
    { code: 'D6740', name: 'Retainer crown porcelain' },
    { code: 'D6750', name: 'Retainer crown high noble' },
  ],
  pontic: [
    { code: 'D6240', name: 'Pontic porcelain' },
    { code: 'D6250', name: 'Pontic high noble' },
  ],
  inlay: [
    { code: 'D2650', name: 'Inlay resin 1 surface' },
    { code: 'D2651', name: 'Inlay resin 2 surfaces' },
  ],
  rct: [
    { code: 'D3310', name: 'Root canal anterior' },
    { code: 'D3320', name: 'Root canal bicuspid' },
  ],
  pulp: [
    { code: 'D3220', name: 'Therapeutic pulpotomy' },
    { code: 'D3221', name: 'Pulpal debridement' },
  ],
  denture: [
    { code: 'D5110', name: 'Complete denture maxillary' },
    { code: 'D5120', name: 'Complete denture mandibular' },
  ],
  partial: [
    { code: 'D5213', name: 'Partial denture maxillary' },
    { code: 'D5214', name: 'Partial denture mandibular' },
  ],
}

const diagnosisOptions = [
  { code: 'DX-01', name: 'Caries incipient' },
  { code: 'DX-02', name: 'Pulpitis' },
  { code: 'DX-03', name: 'Gingivitis' },
  { code: 'DX-04', name: 'Periodontitis' },
  { code: 'DX-05', name: 'Hypersensitivity' },
  { code: 'DX-06', name: 'Fracture risk' },
]

const step = ref(1)
const selectedSurfaces = ref([])
const selectedDiagnosis = ref(null)
const diagnosisQuery = ref('')
const diagnosisOpen = ref(false)
const treatmentTypeQuery = ref('')
const selectedTypeId = ref(null)
const selectedCode = ref(null)

const surfacesDisabled = computed(() => props.selectedTeeth.length === 0)
const stepTitle = computed(() => (step.value === 1 ? 'ГАДАРГУУ СОНГОХ' : 'ЭМЧИЛГЭЭ СОНГОХ'))
const canGoNext = computed(() => selectedSurfaces.value.length > 0 && !surfacesDisabled.value)
const showSkip = computed(() => selectedSurfaces.value.length === 0 && !surfacesDisabled.value)
const filteredDiagnoses = computed(() => {
  const query = diagnosisQuery.value.trim().toLowerCase()
  if (!query) return diagnosisOptions
  return diagnosisOptions.filter(
    (item) => item.name.toLowerCase().includes(query) || item.code.toLowerCase().includes(query),
  )
})
const filteredTreatmentTypes = computed(() => {
  const query = treatmentTypeQuery.value.trim().toLowerCase()
  if (!query) return treatmentTypes
  return treatmentTypes.filter((item) => item.label.toLowerCase().includes(query))
})
const typeIndex = computed(() => filteredTreatmentTypes.value.findIndex((item) => item.id === selectedTypeId.value))
const selectedType = computed(() =>
  filteredTreatmentTypes.value.find((item) => item.id === selectedTypeId.value) || filteredTreatmentTypes.value[0],
)
const codesForSelectedType = computed(() => (selectedType.value ? treatmentCodesByType[selectedType.value.id] || [] : []))

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
  if (surfacesDisabled.value) return
  selectedSurfaces.value = []
  emit('update:surfaces', [])
  step.value = 2
}

function goBack() {
  step.value = 1
}

function setType(typeId) {
  selectedTypeId.value = typeId
  emit('update:typeId', selectedTypeId.value)
  selectCode(null)
}

function prevType() {
  if (!filteredTreatmentTypes.value.length) return
  const nextIndex = typeIndex.value <= 0 ? filteredTreatmentTypes.value.length - 1 : typeIndex.value - 1
  setType(filteredTreatmentTypes.value[nextIndex].id)
}

function nextType() {
  if (!filteredTreatmentTypes.value.length) return
  const nextIndex = typeIndex.value >= filteredTreatmentTypes.value.length - 1 ? 0 : typeIndex.value + 1
  setType(filteredTreatmentTypes.value[nextIndex].id)
}

function selectTypeFromGrid(typeId) {
  if (selectedTypeId.value === typeId) {
    setType(null)
    return
  }
  setType(typeId)
}

function selectCode(code) {
  selectedCode.value = code
  emit('update:code', code)
}

watch(
  () => props.selectedTeeth.length,
  (count) => {
    if (count === 0) {
      step.value = 1
      selectedSurfaces.value = []
      emit('update:surfaces', [])
    }
  },
)

watch(
  filteredTreatmentTypes,
  (list) => {
    if (!list.length) {
      setType(null)
      return
    }
    if (!list.some((item) => item.id === selectedTypeId.value)) {
      setType(list[0].id)
    }
  },
  { immediate: true },
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

    <p v-if="surfacesDisabled" class="mt-4 text-sm text-amber-600">Эхлээд шүд сонгоно уу.</p>

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
            :disabled="surfacesDisabled"
            @focus="diagnosisOpen = true"
            @input="diagnosisOpen = true"
            @blur="closeDiagnosisDropdown"
          />
          <button
            type="button"
            class="absolute inset-y-0 right-2 flex items-center px-2 text-slate-400"
            :disabled="surfacesDisabled"
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
          class="text-sm font-semibold text-slate-500 hover:text-blue-600 disabled:opacity-50"
          :disabled="surfacesDisabled"
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
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-700 disabled:opacity-50"
          :disabled="surfacesDisabled"
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
            :disabled="surfacesDisabled"
          />
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-700 disabled:opacity-50"
            :disabled="surfacesDisabled || !filteredTreatmentTypes.length"
            @click="prevType"
          >
            <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m11 6-4 4 4 4" />
            </svg>
          </button>
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-700 disabled:opacity-50"
            :disabled="surfacesDisabled || !filteredTreatmentTypes.length"
            @click="nextType"
          >
            <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m9 6 4 4-4 4" />
            </svg>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <button
          v-for="item in filteredTreatmentTypes"
          :key="item.id"
          type="button"
          :class="[
            'flex min-h-[44px] items-center justify-center rounded-xl border px-2 text-sm text-slate-700 text-center transition hover:border-blue-400 hover:text-blue-700',
            selectedType?.id === item.id
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-slate-200 bg-white',
            surfacesDisabled ? 'opacity-50 cursor-not-allowed' : '',
          ]"
          :disabled="surfacesDisabled"
          @click="selectTypeFromGrid(item.id)"
        >
          <span class="leading-tight">{{ item.label }}</span>
        </button>
      </div>

      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-semibold tracking-[0.08em] text-slate-400">ЭМЧИЛГЭЭНИЙ КОД</p>
          <p v-if="selectedType?.label" class="text-xs font-semibold text-slate-500">{{ selectedType.label }}</p>
        </div>
        <div v-if="selectedType" class="space-y-3">
          <div
            v-if="selectedType.surfaceRequired && selectedSurfaces.length === 0"
            class="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700"
          >
            <span>Гадаргуу сонгоно уу.</span>
            <button type="button" class="font-semibold underline" @click="goBack">Буцах</button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              v-for="item in codesForSelectedType"
              :key="item.code"
              type="button"
              :class="[
                'flex items-center justify-between rounded-xl border px-3 py-2 text-left text-sm text-slate-700 transition hover:border-blue-400 hover:text-blue-700',
                selectedCode?.code === item.code
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 bg-white',
                surfacesDisabled ? 'opacity-50 cursor-not-allowed' : '',
              ]"
              :disabled="surfacesDisabled"
              @click="selectCode(item)"
            >
              <span class="font-semibold">{{ item.code }}</span>
              <span class="text-xs text-slate-500">{{ item.name }}</span>
            </button>
          </div>
        </div>
        <p v-else class="text-sm text-slate-500">Эхлээд эмчилгээний төрлөө сонгоно уу.</p>
      </div>
    </div>
  </section>
</template>
