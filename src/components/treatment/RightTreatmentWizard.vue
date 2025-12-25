<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import diagnoses from '@/data/diagnoses'

const props = defineProps({
  selectedTeeth: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:surfaces', 'update:diagnosis', 'update:typeId', 'update:code', 'add'])

const step = ref(1)
const selectedSurfaces = ref([])
const selectedDiagnosis = ref(null)
const diagnosisQuery = ref('')
const showDiagnosisDropdown = ref(false)
const dropdownPlacement = ref('bottom')
const wizardRef = ref(null)
const diagnosisTriggerRef = ref(null)

const selectedCodes = ref([])
const showTooltipCode = ref(null)

const treatmentTypes = [
  { id: 'root-canal', label: 'Root Canal' },
  { id: 'extraction', label: 'Extraction' },
  { id: 'restoration', label: 'Restoration' },
  { id: 'prosthodontics', label: 'Prosthodontics' },
]

const treatmentCodesByType = {
  'root-canal': [
    { code: 'D3220', nameMn: 'Моляр шүдний сувгийн эмчилгээ' },
    { code: 'D3221', nameMn: 'Премоляр сувгийн өргөтгөх ба эмчилгээ' },
    { code: 'D3222', nameMn: 'Нэг сувгийн тайвшруулах эмчилгээ' },
    { code: 'D3222', nameMn: 'Нэг сувгийн тайвшруулах эмчилгээ' },
    { code: 'D3222', nameMn: 'Нэг сувгийн тайвшруулах эмчилгээ' },
  ],
  extraction: [
    { code: 'D7140', nameMn: 'Энгийн суудлын суваг авах' },
    { code: 'D7210', nameMn: 'Мэс заслын хүндрэлийн суваг авах' },
    { code: 'D7250', nameMn: 'Хатингаршсан үлдэгдэл суваг авах' },
    { code: 'D7250', nameMn: 'Хатингаршсан үлдэгдэл суваг авах' },
    { code: 'D7250', nameMn: 'Хатингаршсан үлдэгдэл суваг авах' },
    { code: 'D7250', nameMn: 'Хатингаршсан үлдэгдэл суваг авах' },
  ],
  restoration: [
    { code: 'D2391', nameMn: 'Нэг гадаргуун композит ломбо' },
    { code: 'D2392', nameMn: 'Хоёр гадаргуун композит ломбо' },
    { code: 'D2393', nameMn: 'Гурван гадаргуун композит ломбо' },
    { code: 'D2393', nameMn: 'Гурван гадаргуун композит ломбо' },
    { code: 'D2393', nameMn: 'Гурван гадаргуун композит ломбо' },
    { code: 'D2393', nameMn: 'Гурван гадаргуун композит ломбо' },
    { code: 'D2393', nameMn: 'Гурван гадаргуун композит ломбо' },
    { code: 'D2393', nameMn: 'Гурван гадаргуун композит ломбо' },
    { code: 'D2393', nameMn: 'Гурван гадаргуун композит ломбо' },
    { code: 'D2393', nameMn: 'Гурван гадаргуун композит ломбо' },
    { code: 'D2393', nameMn: 'Гурван гадаргуун композит ломбо' },
    { code: 'D2393', nameMn: 'Гурван гадаргуун композит ломбо' },
  ],
  prosthodontics: [
    { code: 'D2750', nameMn: 'Бүрээс, бүрэн металл' },
    { code: 'D2751', nameMn: 'Бүрээс, металл-керамик' },
    { code: 'D2799', nameMn: 'Түр бүрээс хийх' },
  ],
}

const currentTypeIndex = ref(0)
const hasSelectedTeeth = computed(() => props.selectedTeeth?.length > 0)
const currentType = computed(() => treatmentTypes[currentTypeIndex.value])
const currentCodes = computed(() => treatmentCodesByType[currentType.value.id] || [])
const mockDiagnoses = computed(() => diagnoses.slice(0, 6))
const filteredDiagnoses = computed(() => {
  if (!diagnosisQuery.value) return mockDiagnoses.value
  const q = diagnosisQuery.value.toLowerCase()
  return mockDiagnoses.value.filter(
    (item) => item.code.toLowerCase().includes(q) || item.name.toLowerCase().includes(q),
  )
})

const canProceed = computed(() => selectedSurfaces.value.length > 0)
const canAdd = computed(
  () => hasSelectedTeeth.value && selectedSurfaces.value.length > 0 && selectedCodes.value.length > 0,
)

const selectedCodeObjects = computed(() =>
  selectedCodes.value
    .map((code) => currentCodes.value.find((item) => item.code === code))
    .filter(Boolean),
)

watch(
  () => props.selectedTeeth,
  (teeth) => {
    if (!teeth?.length) {
      selectedSurfaces.value = []
      selectedDiagnosis.value = null
      diagnosisQuery.value = ''
      showDiagnosisDropdown.value = false

      selectedCodes.value = []
      currentTypeIndex.value = 0
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
  () => currentType.value?.id,
  (id) => {
    emit('update:typeId', id)
    selectedCodes.value = []
    showTooltipCode.value = null
  },
  { immediate: true },
)

watch(
  () => selectedCodes.value,
  (codes) => {
    emit('update:code', codes)
  },
  { deep: true },
)

function updateDropdownPlacement() {
  if (!wizardRef.value || !diagnosisTriggerRef.value) return
  const containerRect = wizardRef.value.getBoundingClientRect()
  const triggerRect = diagnosisTriggerRef.value.getBoundingClientRect()
  const spaceBelow = containerRect.bottom - triggerRect.bottom
  const spaceAbove = triggerRect.top - containerRect.top
  const minSpace = 220
  dropdownPlacement.value =
    spaceBelow < minSpace && spaceAbove > spaceBelow ? 'top' : 'bottom'
}

watch(showDiagnosisDropdown, async (open) => {
  if (!open) return
  await nextTick()
  updateDropdownPlacement()
})

onMounted(() => {
  window.addEventListener('resize', updateDropdownPlacement)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateDropdownPlacement)
})

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
  if (canProceed.value) step.value = 2
}

function skipSurfaces() {
  selectedSurfaces.value = []
  step.value = 2
}

function goBack() {
  step.value = 1
}

function prevType() {
  currentTypeIndex.value = (currentTypeIndex.value - 1 + treatmentTypes.length) % treatmentTypes.length
}

function nextType() {
  currentTypeIndex.value = (currentTypeIndex.value + 1) % treatmentTypes.length
}

function toggleCode(code) {
  if (selectedCodes.value.includes(code)) {
    selectedCodes.value = selectedCodes.value.filter((item) => item !== code)
  } else {
    selectedCodes.value = [...selectedCodes.value, code]
  }
}

function toggleTooltip(code) {
  showTooltipCode.value = showTooltipCode.value === code ? null : code
}

function handleAdd() {
  if (!canAdd.value) return
  emit('add', selectedCodeObjects.value)
}
</script>

<template>
  <section
    ref="wizardRef"
    class=" h-[calc(85vh-180px)] relative overflow-visible w-full max-w-[420px] bg-white border border-slate-200 rounded-2xl shadow-sm p-5"
  >
    <div class="flex items-start justify-between mb-4">
      <p class="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
        {{ step === 1 ? '2. Гадаргуу сонгох' : 'Эмчилгээ сонгох' }}
      </p>
      <p class="text-xs font-semibold text-slate-400">{{ step }}/2</p>
    </div>

    <!-- STEP 1 -->
    <div v-if="step === 1" class="space-y-6">
      <div class="flex flex-col items-center gap-4">
        <div class="grid grid-cols-3 gap-2 justify-items-center w-full max-w-[220px]">
          <div></div>
                <button
                  type="button"
                  class="w-14 h-14 rounded-xl border text-sm font-semibold transition
                        bg-white text-slate-700 border-slate-200
                        hover:border-slate-300 hover:bg-slate-50
                        active:scale-[0.98]
                        disabled:opacity-50 disabled:cursor-not-allowed"
                  :class="selectedSurfaces.includes('B/F')
                    ? 'border-blue-600 bg-blue-50 text-slate-900 ring-2 ring-blue-400 ring-offset-2 ring-offset-white'
                    : ''"
                  :disabled="!hasSelectedTeeth"
                  @click="toggleSurface('B/F')"
                >
                  B/F
                </button>

          <div></div>

          <button
            type="button"
            class="w-14 h-14 rounded-xl border text-sm font-semibold transition bg-white text-slate-500 border-slate-200 hover:bg-slate-50 disabled:opacity-50"
            :class="selectedSurfaces.includes('M') ? 'bg-emerald-50 border-blue-500 text-emerald-700 ring-2 ring-blue-400 ring-offset-2 ring-offset-white' : ''"
            :disabled="!hasSelectedTeeth"
            @click="toggleSurface('M')"
          >
            M
          </button>

          <button
            type="button"
            class="w-14 h-14 rounded-xl border text-sm font-semibold transition bg-white text-slate-500 border-slate-200 hover:bg-slate-50 disabled:opacity-50"
            :class="selectedSurfaces.includes('O/I') ? 'bg-emerald-50 border-blue-500 text-emerald-700 ring-2 ring-blue-400 ring-offset-2 ring-offset-white' : ''"
            :disabled="!hasSelectedTeeth"
            @click="toggleSurface('O/I')"
          >
            O/I
          </button>

          <button
            type="button"
            class="w-14 h-14 rounded-xl border text-sm font-semibold transition bg-white text-slate-500 border-slate-200 hover:bg-slate-50 disabled:opacity-50"
            :class="selectedSurfaces.includes('D') ? 'bg-emerald-50 border-blue-500 text-emerald-700 ring-2 ring-blue-400 ring-offset-2 ring-offset-white' : ''"
            :disabled="!hasSelectedTeeth"
            @click="toggleSurface('D')"
          >
            D
          </button>

          <div></div>
          <button
            type="button"
            class="w-14 h-14 rounded-xl border text-sm font-semibold transition bg-white text-slate-500 border-slate-200 hover:bg-slate-50 disabled:opacity-50"
            :class="selectedSurfaces.includes('L/P') ? 'bg-emerald-50 border-blue-500 text-emerald-700 ring-2 ring-blue-400 ring-offset-2 ring-offset-white' : ''"
            :disabled="!hasSelectedTeeth"
            @click="toggleSurface('L/P')"
          >
            L/P
          </button>
          <div></div>
        </div>
  
      </div>

      <!-- DIAGNOSIS UI (RESTORED) -->
      <div class="space-y-2">
        <p class="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Эмчилгээний онош</p>

        <div class="relative">
          <div
            ref="diagnosisTriggerRef"
            class="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 bg-white cursor-text"
            @click="showDiagnosisDropdown = !showDiagnosisDropdown"
          >
            <input
              v-model="diagnosisQuery"
              type="text"
              placeholder="ХАЙХ"
              class="w-full bg-transparent text-sm text-slate-600 focus:outline-none"
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
            class="absolute left-0 right-0 z-10 w-full rounded-xl border border-slate-200 bg-white shadow-md overflow-hidden"
            :class="dropdownPlacement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'"
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

          <p v-if="selectedDiagnosis" class="mt-2 text-xs text-emerald-700">
            {{ selectedDiagnosis.code }} · {{ selectedDiagnosis.name }}
          </p>
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

    <!-- STEP 2 -->
    <div v-else class="h-full overflow-auto pr-1 pb-[88px] space-y-6">
      <div class="flex items-center justify-between">
        <button
          type="button"
          class="h-9 w-9 inline-flex items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
          @click="prevType"
        >
          <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fill-rule="evenodd"
              d="M12.78 4.22a.75.75 0 010 1.06L8.06 10l4.72 4.72a.75.75 0 11-1.06 1.06l-5.25-5.25a.75.75 0 010-1.06l5.25-5.25a.75.75 0 011.06 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <div class="px-4 py-2 rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
          {{ currentType?.label }}
        </div>

        <button
          type="button"
          class="h-9 w-9 inline-flex items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
          @click="nextType"
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

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <div v-for="item in currentCodes" :key="item.code" class="relative group">
          <button
            type="button"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            :class="selectedCodes.includes(item.code) ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-200' : ''"
            @click="toggleCode(item.code)"
          >
            <span class="block text-center">{{ item.code }}</span>
          </button>

          <!-- <button
            type="button"
            class="absolute top-2 right-2 h-6 w-6 inline-flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 shadow-sm hover:text-slate-600"
            @click.stop="toggleTooltip(item.code)"
            aria-label="Code info"
          >
            <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 10-1.5 0 .75.75 0 001.5 0zM9.25 9a.75.75 0 000 1.5h.5v3.25a.75.75 0 001.5 0V9.75A.75.75 0 0010.5 9h-1.25z"
                clip-rule="evenodd"
              />
            </svg>
          </button> -->

          <div
            class="pointer-events-none absolute z-50 left-1/2 top-full mt-2 -translate-x-1/2
                  rounded-md bg-slate-900 text-white px-2 py-1 text-xs font-medium shadow-lg
                  opacity-0 translate-y-1 transition duration-150 ease-out
                  group-hover:opacity-100 group-hover:translate-y-0
                  after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2
                  after:-top-1 after:border-[6px] after:border-transparent after:border-b-slate-900"
            :class="showTooltipCode === item.code ? '!opacity-100 !translate-y-0' : ''"
          >
            {{ item.nameMn }}
          </div>
        </div>
      </div>

      <div class="absolute left-5 right-5 bottom-5 bg-white">
        <div class="flex gap-4">
          <button
            type="button"
            class="flex-1 h-10 rounded-xl bg-slate-200 text-slate-700 shadow-sm font-semibold hover:bg-slate-300"
            @click="goBack"
          >
            Буцах
          </button>
          <button
            type="button"
            class="flex-1 h-10 rounded-xl bg-blue-600 text-white shadow-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!canAdd"
            @click="handleAdd"
          >
            Нэмэх
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
