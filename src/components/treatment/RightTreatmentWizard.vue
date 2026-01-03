<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
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
const wizardRef = ref(null)
const diagnosisTriggerRef = ref(null)
const diagnosisDropdownRef = ref(null)
const dropdownStyles = ref({ top: '0px', left: '0px', width: '0px' })
const dropdownPlacement = ref('bottom')
let dropdownRafId = null

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

const updateDropdownPosition = () => {
  if (!showDiagnosisDropdown.value || !diagnosisTriggerRef.value || typeof window === 'undefined') return
  const rect = diagnosisTriggerRef.value.getBoundingClientRect()
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight
  const gap = 8
  const minWidth = 220
  let width = Math.max(rect.width, minWidth)
  width = Math.min(width, viewportWidth - gap * 2)
  let left = rect.left
  if (left + width > viewportWidth - gap) {
    left = Math.max(gap, viewportWidth - width - gap)
  }
  const dropdownHeight = diagnosisDropdownRef.value?.offsetHeight || 0
  const spaceBelow = viewportHeight - rect.bottom - gap
  const spaceAbove = rect.top - gap
  const openUp = dropdownHeight > 0 && spaceBelow < dropdownHeight && spaceAbove > spaceBelow
  const top = openUp ? Math.max(gap, rect.top - dropdownHeight - gap) : rect.bottom + gap

  dropdownPlacement.value = openUp ? 'top' : 'bottom'
  dropdownStyles.value = {
    top: `${top}px`,
    left: `${left}px`,
    width: `${width}px`,
  }
}

const scheduleDropdownUpdate = () => {
  if (typeof window === 'undefined') return
  if (dropdownRafId) cancelAnimationFrame(dropdownRafId)
  dropdownRafId = requestAnimationFrame(updateDropdownPosition)
}

const addDropdownListeners = () => {
  if (typeof window === 'undefined') return
  window.addEventListener('resize', scheduleDropdownUpdate)
  window.addEventListener('scroll', scheduleDropdownUpdate, true)
}

const removeDropdownListeners = () => {
  if (typeof window === 'undefined') return
  window.removeEventListener('resize', scheduleDropdownUpdate)
  window.removeEventListener('scroll', scheduleDropdownUpdate, true)
}

watch(
  () => showDiagnosisDropdown.value,
  async (open) => {
    if (open) {
      await nextTick()
      scheduleDropdownUpdate()
      addDropdownListeners()
    } else {
      removeDropdownListeners()
    }
  },
)

watch(
  () => diagnosisQuery.value,
  () => {
    if (showDiagnosisDropdown.value) scheduleDropdownUpdate()
  },
)

onBeforeUnmount(() => {
  removeDropdownListeners()
  if (dropdownRafId) cancelAnimationFrame(dropdownRafId)
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
    :class="[
      'treatment-wizard',
      'card',
      'treatment-wizard--responsive',
      'mx-auto w-full max-w-md lg:max-w-none',
      step === 1 ? 'treatment-wizard--step1' : 'treatment-wizard--step2'
    ]"
  >
    <div class="flex items-start justify-between mb-4">
      <p class="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
        {{ step === 1 ? '2. Гадаргуу сонгох' : 'Эмчилгээ сонгох' }}
      </p>
      <p class="text-xs font-semibold text-slate-400">{{ step }}/2</p>
    </div>

    <!-- STEP 1 -->
    <div v-if="step === 1" class="space-y-4">
      <div class="flex flex-col items-center gap-4">
        <div class="treatment-surface-grid">
          <div></div>
                <button
                  type="button"
                  class="treatment-surface-button"
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
            class="treatment-surface-button"
            :class="selectedSurfaces.includes('M') ? 'bg-emerald-50 border-blue-500 text-emerald-700 ring-2 ring-blue-400 ring-offset-2 ring-offset-white' : ''"
            :disabled="!hasSelectedTeeth"
            @click="toggleSurface('M')"
          >
            M
          </button>

          <button
            type="button"
            class="treatment-surface-button"
            :class="selectedSurfaces.includes('O/I') ? 'bg-emerald-50 border-blue-500 text-emerald-700 ring-2 ring-blue-400 ring-offset-2 ring-offset-white' : ''"
            :disabled="!hasSelectedTeeth"
            @click="toggleSurface('O/I')"
          >
            O/I
          </button>

          <button
            type="button"
            class="treatment-surface-button"
            :class="selectedSurfaces.includes('D') ? 'bg-emerald-50 border-blue-500 text-emerald-700 ring-2 ring-blue-400 ring-offset-2 ring-offset-white' : ''"
            :disabled="!hasSelectedTeeth"
            @click="toggleSurface('D')"
          >
            D
          </button>

          <div></div>
          <button
            type="button"
            class="treatment-surface-button"
            :class="selectedSurfaces.includes('L/P') ? 'bg-emerald-50 border-blue-500 text-emerald-700 ring-2 ring-blue-400 ring-offset-2 ring-offset-white' : ''"
            :disabled="!hasSelectedTeeth"
            @click="toggleSurface('L/P')"
          >
            L/P
          </button>
          <div></div>
        </div>
  
      </div>

      <div class="space-y-3">
        <!-- DIAGNOSIS UI (RESTORED) -->
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Эмчилгээний онош</p>

          <div class="relative">
            <div
              ref="diagnosisTriggerRef"
              class="treatment-diagnosis-trigger"
              @click="showDiagnosisDropdown = !showDiagnosisDropdown"
            >
              <input
                v-model="diagnosisQuery"
                type="text"
                placeholder="ХАЙХ"
                class="treatment-input w-full bg-transparent text-slate-600 focus:outline-none"
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

            <Teleport to="body">
              <div
                v-if="showDiagnosisDropdown"
                ref="diagnosisDropdownRef"
                class="treatment-diagnosis-dropdown"
                :class="dropdownPlacement === 'top'
                  ? 'treatment-diagnosis-dropdown--top'
                  : 'treatment-diagnosis-dropdown--bottom'"
                :style="dropdownStyles"
              >
                <button
                  type="button"
                  class="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                  @click.stop="clearDiagnosis"
                >
                  Алгасах
                </button>
                <div class="treatment-diagnosis-list divide-y divide-slate-100">
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
            </Teleport>

            <p v-if="selectedDiagnosis" class="mt-2 text-xs text-emerald-700">
              {{ selectedDiagnosis.code }} · {{ selectedDiagnosis.name }}
            </p>
          </div>
        </div>

        <div class="flex items-center justify-between gap-2">
          <button
            type="button"
            class="treatment-action-secondary"
            :disabled="!canProceed"
            @click="goNext"
          >
            <span class="treatment-hit-visual">Эмчилгээ сонгох</span>
          </button>
        </div>
      </div>
    </div>

    <!-- STEP 2 -->
    <div v-else class="treatment-wizard__step-body space-y-4 lg:space-y-4 xl:space-y-6 min-w-0">
      <div class="flex items-center justify-between">
        <button
          type="button"
          class="treatment-icon-button"
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

        <div class="treatment-type-pill min-w-0">
          {{ currentType?.label }}
        </div>

        <button
          type="button"
          class="treatment-icon-button"
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

      <div class="grid grid-cols-3 gap-2 lg:grid-cols-2 xl:grid-cols-3 min-w-0">
        <div v-for="item in currentCodes" :key="item.code" class="relative">
          <button
            type="button"
            class="w-full px-2 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
            :class="selectedCodes.includes(item.code) 
              ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-200' 
              : 'hover:border-slate-300'"
            @click="toggleCode(item.code)"
          >
            <span class="block text-center text-xs font-semibold text-slate-800">{{ item.code }}</span>
          </button>
        </div>
      </div>

      <div class="treatment-action-bar">
        <div class="treatment-action-bar__buttons">
          <button
            type="button"
            class="treatment-action-button treatment-action-button--secondary"
            @click="goBack"
          >
            <span class="treatment-hit-visual">Буцах</span>
          </button>
          <button
            type="button"
            class="treatment-action-button treatment-action-button--primary"
            :disabled="!canAdd"
            @click="handleAdd"
          >
            <span class="treatment-hit-visual">Нэмэх</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
