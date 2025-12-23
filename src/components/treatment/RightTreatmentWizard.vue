<script setup>
import { computed, ref, watch } from 'vue'
import diagnoses from '@/data/diagnoses'

const props = defineProps({
  selectedTeeth: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits([
  'update:surfaces',
  'update:diagnosis',
  'update:typeId',
  'update:code',
  'update:treatmentTypes',
  'add',
])

const step = ref(1)
const selectedSurfaces = ref([])
const selectedDiagnosis = ref(null)
const diagnosisQuery = ref('')
const showDiagnosisDropdown = ref(false)
const treatmentTypeQuery = ref('')
const selectedTypeId = ref('exam')
const selectedCodes = ref([])
const activeInfoCode = ref(null)
const touchStartX = ref(null)

const mockDiagnoses = diagnoses.slice(0, 6)

const treatmentTypeOptions = [
  {
    id: 'exam',
    label: 'Exam',
    value: 'exam',
    codes: [
      { code: 'D0120', name: 'Periodic oral evaluation' },
      { code: 'D0150', name: 'Comprehensive exam' },
      { code: 'D0180', name: 'Comprehensive perio eval' },
    ],
  },
  {
    id: 'x-ray',
    label: 'X-Ray',
    value: 'xray',
    codes: [
      { code: 'D0210', name: 'Intraoral complete series' },
      { code: 'D0220', name: 'Periapical first film' },
      { code: 'D0274', name: 'Bitewings four films' },
    ],
  },
  {
    id: 'prophy-fl',
    label: 'Prophy/Fl',
    value: 'cleaning',
    codes: [
      { code: 'D1110', name: 'Prophylaxis adult' },
      { code: 'D1120', name: 'Prophylaxis child' },
      { code: 'D1206', name: 'Topical fluoride' },
    ],
  },
  {
    id: 'period-srp',
    label: 'Period/SRP',
    value: 'deep-cleaning',
    codes: [
      { code: 'D4341', name: 'Perio scaling 4+ teeth' },
      { code: 'D4342', name: 'Perio scaling 1-3 teeth' },
      { code: 'D4910', name: 'Perio maintenance' },
    ],
  },
  {
    id: 'composite',
    label: 'Composite',
    value: 'composite',
    codes: [
      { code: 'D2330', name: 'Composite 1 surface anterior' },
      { code: 'D2391', name: 'Composite 1 surface posterior' },
      { code: 'D2393', name: 'Composite 3 surface posterior' },
    ],
  },
  {
    id: 'amalgam',
    label: 'Amalgam',
    value: 'amalgam',
    codes: [
      { code: 'D2140', name: 'Amalgam 1 surface' },
      { code: 'D2150', name: 'Amalgam 2 surface' },
      { code: 'D2160', name: 'Amalgam 3 surface' },
    ],
  },
  {
    id: 'crowns',
    label: 'Crowns',
    value: 'crown',
    codes: [
      { code: 'D2750', name: 'Crown porcelain fused to high noble' },
      { code: 'D2783', name: 'Crown 3/4 porcelain' },
      { code: 'D2799', name: 'Provisional crown' },
    ],
  },
  {
    id: 'build-up',
    label: 'Build up/ Pins',
    value: 'base',
    codes: [
      { code: 'D2950', name: 'Core buildup' },
      { code: 'D2954', name: 'Prefabricated post and core' },
      { code: 'D2955', name: 'Post removal' },
    ],
  },
  {
    id: 'extraction',
    label: 'Extraction',
    value: 'extraction',
    codes: [
      { code: 'D7140', name: 'Extraction erupted tooth' },
      { code: 'D7210', name: 'Surgical extraction erupted' },
      { code: 'D7220', name: 'Removal impacted soft tissue' },
    ],
  },
  {
    id: 'bridge-abutment',
    label: 'Bridge Abutment',
    value: 'bridge',
    codes: [
      { code: 'D6750', name: 'Retainer crown porcelain fused to high noble' },
      { code: 'D6792', name: 'Retainer crown indirect resin' },
      { code: 'D6794', name: 'Retainer crown titanium' },
    ],
  },
  {
    id: 'bridge-pontic',
    label: 'Bridge Pontic',
    value: 'bridge',
    codes: [
      { code: 'D6240', name: 'Pontic porcelain fused to high noble' },
      { code: 'D6242', name: 'Pontic porcelain fused to noble' },
      { code: 'D6254', name: 'Pontic porcelain fused to titanium' },
    ],
  },
  {
    id: 'inlay-onlay',
    label: 'Inlay Onlay',
    value: 'inlay',
    codes: [
      { code: 'D2610', name: 'Inlay resin 1 surface posterior' },
      { code: 'D2642', name: 'Onlay porcelain 2 surfaces' },
      { code: 'D2663', name: 'Inlay porcelain 3 or more surfaces' },
    ],
  },
  {
    id: 'root-canal',
    label: 'Root Canal',
    value: 'root-canal',
    codes: [
      { code: 'D3310', name: 'Endodontic therapy anterior' },
      { code: 'D3320', name: 'Endodontic therapy premolar' },
      { code: 'D3330', name: 'Endodontic therapy molar' },
    ],
  },
  {
    id: 'pulp-procedure',
    label: 'Pulp Procedure',
    value: 'pulpotomy',
    codes: [
      { code: 'D3220', name: 'Therapeutic pulpotomy' },
      { code: 'D3221', name: 'Pulpal debridement' },
      { code: 'D3230', name: 'Pulpal therapy primary anterior' },
    ],
  },
  {
    id: 'denture',
    label: 'Denture',
    value: 'denture',
    codes: [
      { code: 'D5110', name: 'Complete denture maxillary' },
      { code: 'D5120', name: 'Complete denture mandibular' },
      { code: 'D5410', name: 'Adjust complete denture maxillary' },
    ],
  },
  {
    id: 'partial-denture',
    label: 'Partial Denture',
    value: 'partial-denture',
    codes: [
      { code: 'D5211', name: 'Partial denture resin maxillary' },
      { code: 'D5212', name: 'Partial denture resin mandibular' },
      { code: 'D5411', name: 'Adjust partial denture maxillary' },
    ],
  },
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

const currentType = computed(() =>
  filteredTreatmentTypes.value.find((item) => item.id === selectedTypeId.value) || filteredTreatmentTypes.value[0],
)

const codesForSelectedType = computed(() => currentType.value?.codes || [])

const selectedCodeKeys = computed(() => selectedCodes.value.map((item) => `${item.typeId}-${item.code}`))
const hasSelectedCodes = computed(() => selectedCodes.value.length > 0)

const canProceed = computed(() => selectedSurfaces.value.length > 0)

watch(
  () => props.selectedTeeth,
  (teeth) => {
    if (!teeth?.length) {
      selectedSurfaces.value = []
      selectedDiagnosis.value = null
      diagnosisQuery.value = ''
      treatmentTypeQuery.value = ''
      selectedCodes.value = []
      selectedTypeId.value = 'exam'
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
  () => selectedTypeId.value,
  (typeId) => {
    emit('update:typeId', typeId || null)
  },
)

watch(
  () => selectedCodes.value,
  (codes) => {
    const lastSelected = codes[codes.length - 1] || null
    emit('update:code', lastSelected)
    const typeIds = [...new Set(codes.map((item) => item.typeId))]
    emit('update:treatmentTypes', typeIds)
  },
  { deep: true },
)

watch(
  () => filteredTreatmentTypes.value,
  (list) => {
    if (!list.length) {
      selectedTypeId.value = null
      return
    }
    const stillExists = list.some((item) => item.id === selectedTypeId.value)
    if (!stillExists) {
      selectedTypeId.value = list[0].id
    }
  },
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

function goBackToStepOne() {
  step.value = 1
}

function selectType(typeId) {
  selectedTypeId.value = typeId
}

function toggleCode(codeItem) {
  const key = `${selectedTypeId.value}-${codeItem.code}`
  const existingIndex = selectedCodeKeys.value.indexOf(key)
  if (existingIndex !== -1) {
    selectedCodes.value = selectedCodes.value.filter((item) => `${item.typeId}-${item.code}` !== key)
  } else {
    selectedCodes.value = [...selectedCodes.value, { ...codeItem, typeId: selectedTypeId.value }]
  }
}

function goPrevType() {
  if (!filteredTreatmentTypes.value.length) return
  const currentIndex = filteredTreatmentTypes.value.findIndex((item) => item.id === selectedTypeId.value)
  const newIndex = currentIndex <= 0 ? filteredTreatmentTypes.value.length - 1 : currentIndex - 1
  selectedTypeId.value = filteredTreatmentTypes.value[newIndex].id
}

function goNextType() {
  if (!filteredTreatmentTypes.value.length) return
  const currentIndex = filteredTreatmentTypes.value.findIndex((item) => item.id === selectedTypeId.value)
  const newIndex = currentIndex === -1 || currentIndex === filteredTreatmentTypes.value.length - 1 ? 0 : currentIndex + 1
  selectedTypeId.value = filteredTreatmentTypes.value[newIndex].id
}

function handleWheel(event) {
  if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return
  if (event.deltaX > 25) {
    goNextType()
  } else if (event.deltaX < -25) {
    goPrevType()
  }
}

function onTouchStart(event) {
  touchStartX.value = event.changedTouches[0]?.clientX ?? null
}

function onTouchEnd(event) {
  if (touchStartX.value === null) return
  const diffX = event.changedTouches[0]?.clientX - touchStartX.value
  if (diffX > 40) {
    goPrevType()
  } else if (diffX < -40) {
    goNextType()
  }
  touchStartX.value = null
}

function toggleInfo(code) {
  activeInfoCode.value = activeInfoCode.value === code ? null : code
}

function isCodeSelected(code) {
  return selectedCodeKeys.value.includes(`${selectedTypeId.value}-${code}`)
}

function isTooltipVisible(code) {
  return activeInfoCode.value === code
}

function handleAdd() {
  if (!hasSelectedCodes.value) return
  emit('add', selectedCodes.value)
}
</script>

<template>
  <section class="dental-card w-full max-w-[420px] rounded-2xl border-slate-200 shadow-sm p-5">
    <div class="flex items-start justify-between mb-5">
      <p class="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
        {{ step === 1 ? 'Гадаргуу сонгох' : 'Эмчилгээ сонгох' }}
      </p>
      <p class="text-xs font-semibold text-slate-400">{{ step }}/2</p>
    </div>

    <div v-if="step === 1" class="space-y-6">
      <div class="flex flex-col items-center gap-4">
        <div class="grid grid-cols-3 gap-3 justify-items-center w-full max-w-[240px]">
          <div></div>
          <button
            type="button"
            class="w-14 h-14 rounded-xl border text-sm font-semibold transition bg-white text-slate-600 border-slate-200 hover:bg-slate-50 disabled:opacity-50"
            :class="selectedSurfaces.includes('B/F') ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : ''"
            :disabled="!hasSelectedTeeth"
            @click="toggleSurface('B/F')"
          >
            B/F
          </button>
          <div></div>

          <button
            type="button"
            class="w-14 h-14 rounded-xl border text-sm font-semibold transition bg-white text-slate-600 border-slate-200 hover:bg-slate-50 disabled:opacity-50"
            :class="selectedSurfaces.includes('M') ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : ''"
            :disabled="!hasSelectedTeeth"
            @click="toggleSurface('M')"
          >
            M
          </button>

          <button
            type="button"
            class="w-14 h-14 rounded-xl border text-sm font-semibold transition bg-white text-slate-600 border-slate-200 hover:bg-slate-50 disabled:opacity-50"
            :class="selectedSurfaces.includes('O/I') ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : ''"
            :disabled="!hasSelectedTeeth"
            @click="toggleSurface('O/I')"
          >
            O/I
          </button>

          <button
            type="button"
            class="w-14 h-14 rounded-xl border text-sm font-semibold transition bg-white text-slate-600 border-slate-200 hover:bg-slate-50 disabled:opacity-50"
            :class="selectedSurfaces.includes('D') ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : ''"
            :disabled="!hasSelectedTeeth"
            @click="toggleSurface('D')"
          >
            D
          </button>

          <div></div>
          <button
            type="button"
            class="w-14 h-14 rounded-xl border text-sm font-semibold transition bg-white text-slate-600 border-slate-200 hover:bg-slate-50 disabled:opacity-50"
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
              <path
                fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                clip-rule="evenodd"
              />
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
          class="min-h-[44px] px-5 py-2 rounded-full border border-slate-200 text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
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

    <div
      v-else
      class="space-y-5"
      @wheel.passive="handleWheel"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
    >
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="h-9 w-9 inline-flex items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
          @click="goPrevType"
          :disabled="!filteredTreatmentTypes.length"
        >
          <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fill-rule="evenodd"
              d="M12.78 4.22a.75.75 0 010 1.06L8.06 10l4.72 4.72a.75.75 0 11-1.06 1.06l-5.25-5.25a.75.75 0 010-1.06l5.25-5.25a.75.75 0 011.06 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <div class="flex-1">
          <div class="flex items-center rounded-full border border-slate-200 bg-white px-3 py-2">
            <svg class="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M9 3.5a5.5 5.5 0 103.473 9.8l2.613 2.614a.75.75 0 101.06-1.06l-2.613-2.615A5.5 5.5 0 009 3.5zm-4 5.5a4 4 0 118 0 4 4 0 01-8 0z"
                clip-rule="evenodd"
              />
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
          class="h-9 w-9 inline-flex items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
          @click="goNextType"
          :disabled="!filteredTreatmentTypes.length"
        >
          <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fill-rule="evenodd"
              d="M7.22 4.22a.75.75 0 011.06 0l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 11-1.06-1.06L11.94 10 7.22 5.28a.75.75 0 010-1.06z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        <button
          v-for="item in filteredTreatmentTypes"
          :key="item.id"
          type="button"
          class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          :class="item.id === selectedTypeId ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : ''"
          @click="selectType(item.id)"
        >
          {{ item.label }}
        </button>
        <p v-if="!filteredTreatmentTypes.length" class="col-span-full text-center text-sm text-slate-500 py-4">Төрөл олдсонгүй</p>
      </div>

      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Эмчилгээний код</p>
          <span v-if="currentType" class="text-xs text-slate-500">{{ currentType.label }}</span>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <div
            v-for="code in codesForSelectedType"
            :key="code.code"
            class="group relative"
            @mouseleave="activeInfoCode = null"
          >
            <button
              type="button"
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-left text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              :class="isCodeSelected(code.code) ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : ''"
              @click="toggleCode(code)"
            >
              <div class="flex items-start justify-between gap-2">
                <div>
                  <p class="text-sm font-semibold">{{ code.code }}</p>
                  <p class="text-xs text-slate-500 mt-1 line-clamp-2">{{ code.name }}</p>
                </div>
                <button
                  type="button"
                  class="shrink-0 rounded-full p-1 text-slate-400 hover:text-slate-600"
                  @click.stop="toggleInfo(code.code)"
                >
                  <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-11.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM10 8.5a.75.75 0 00-.75.75v4a.75.75 0 001.5 0v-4A.75.75 0 0010 8.5z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </button>
            <div
              class="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-2 rounded-lg bg-slate-800 px-3 py-2 text-xs text-white shadow-md opacity-0 translate-y-1 transition duration-200 ease-out delay-150"
              :class="{
                'opacity-100 translate-y-0': isTooltipVisible(code.code),
                'group-hover:opacity-100 group-hover:translate-y-0': true,
              }"
            >
              {{ code.name }}
            </div>
          </div>
          <p v-if="!codesForSelectedType.length" class="col-span-full text-center text-sm text-slate-500 py-4">Код олдсонгүй</p>
        </div>
      </div>

      <div class="space-y-2">
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="flex-1 h-12 rounded-2xl bg-slate-200 text-slate-700 text-sm font-semibold shadow-sm hover:bg-slate-300"
            @click="goBackToStepOne"
          >
            Буцах
          </button>
          <button
            type="button"
            class="flex-1 h-12 rounded-2xl bg-blue-600 text-white text-sm font-semibold shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!hasSelectedCodes"
            @click="handleAdd"
          >
            Нэмэх
          </button>
        </div>
        <p v-if="!hasSelectedCodes" class="text-xs text-slate-500">Эмчилгээ сонгоно уу</p>
      </div>
    </div>
  </section>
</template>
