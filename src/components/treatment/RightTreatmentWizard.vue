<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import diagnoses from '@/data/diagnoses'
import { treatmentCodesByType, wizardTreatmentTypes } from '@/data/treatmentWizardOptions'

const props = defineProps({
  selectedSurfaces: {
    type: Array,
    default: () => [],
  },
  selectedDiagnosis: {
    type: Object,
    default: null,
  },
  selectedCodes: {
    type: Array,
    default: () => [],
  },
  selectedStatus: {
    type: String,
    default: 'planned',
  },
  canAdd: {
    type: Boolean,
    default: false,
  },
  requiresTooth: {
    type: Boolean,
    default: false,
  },
  requiresSurface: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:surfaces', 'update:diagnosis', 'update:code', 'update:status', 'add'])
const diagnosisQuery = ref('')
const showDiagnosisDropdown = ref(false)
const showSurfaceDropdown = ref(false)
const wizardRef = ref(null)
const diagnosisTriggerRef = ref(null)
const surfaceTriggerRef = ref(null)
const diagnosisDropdownRef = ref(null)
const surfaceDropdownRef = ref(null)
const dropdownStyles = ref({ top: '0px', left: '0px', width: '0px' })
const surfaceDropdownStyles = ref({ top: '0px', left: '0px', width: '0px' })
const dropdownPlacement = ref('bottom')
const surfaceDropdownPlacement = ref('bottom')
let dropdownRafId = null
let surfaceDropdownRafId = null

const showTooltipCode = ref(null)
const showCategoryDropdown = ref(false)

const maxPreviewCodes = 3
const statusOptions = [
  { id: 'done', label: 'Дууссан' },
  { id: 'planned', label: 'Төлөвлөгөөт' },
]

// Legacy mock codes kept as a fallback for missing wizard options.
const legacyTreatmentCodesByType = {
  'root-canal': [
    { code: 'D3220', nameMn: 'Сувгийн эмчилгээ (анхан шат)' },
    { code: 'D3221', nameMn: 'Сувгийн эмчилгээ (дахин боловсруулалт)' },
    { code: 'D3222', nameMn: 'Сувгийн эмчилгээ (олон суваг)' },
    { code: 'D3222', nameMn: 'Сувгийн эмчилгээ (олон суваг)' },
    { code: 'D3222', nameMn: 'Сувгийн эмчилгээ (олон суваг)' },
  ],
  extraction: [
    { code: 'D7140', nameMn: 'Энгийн шүд авах' },
    { code: 'D7210', nameMn: 'Мэс заслын шүд авах' },
    { code: 'D7250', nameMn: 'Үлдэгдэл үндэс авах' },
    { code: 'D7250', nameMn: 'Үлдэгдэл үндэс авах' },
    { code: 'D7250', nameMn: 'Үлдэгдэл үндэс авах' },
    { code: 'D7250', nameMn: 'Үлдэгдэл үндэс авах' },
  ],
  restoration: [
    { code: 'D2391', nameMn: 'Нийлмэл ломбо 1 гадаргуу' },
    { code: 'D2392', nameMn: 'Нийлмэл ломбо 2 гадаргуу' },
    { code: 'D2393', nameMn: 'Нийлмэл ломбо 3+ гадаргуу' },
    { code: 'D2393', nameMn: 'Нийлмэл ломбо 3+ гадаргуу' },
    { code: 'D2393', nameMn: 'Нийлмэл ломбо 3+ гадаргуу' },
    { code: 'D2393', nameMn: 'Нийлмэл ломбо 3+ гадаргуу' },
    { code: 'D2393', nameMn: 'Нийлмэл ломбо 3+ гадаргуу' },
    { code: 'D2393', nameMn: 'Нийлмэл ломбо 3+ гадаргуу' },
    { code: 'D2393', nameMn: 'Нийлмэл ломбо 3+ гадаргуу' },
    { code: 'D2393', nameMn: 'Нийлмэл ломбо 3+ гадаргуу' },
    { code: 'D2393', nameMn: 'Нийлмэл ломбо 3+ гадаргуу' },
    { code: 'D2393', nameMn: 'Нийлмэл ломбо 3+ гадаргуу' },
  ],
  prosthodontics: [
    { code: 'D2750', nameMn: 'Металл-порцелан бүрээс' },
    { code: 'D2751', nameMn: 'Металл-резин бүрээс' },
    { code: 'D2799', nameMn: 'Бусад төрлийн бүрээс' },
  ],
}


const currentTypeIndex = ref(0)
const selectedSurfaces = computed({
  get: () => (Array.isArray(props.selectedSurfaces) ? props.selectedSurfaces : []),
  set: (value) => emit('update:surfaces', value),
})
const selectedDiagnosis = computed({
  get: () => props.selectedDiagnosis,
  set: (value) => emit('update:diagnosis', value),
})
const selectedCodes = computed({
  get: () => (Array.isArray(props.selectedCodes) ? props.selectedCodes : []),
  set: (value) => emit('update:code', value),
})
const statusSelection = computed({
  get: () => props.selectedStatus || 'planned',
  set: (value) => emit('update:status', value),
})
const selectedCodeSet = computed(() =>
  new Set(selectedCodes.value.map((item) => item?.code).filter(Boolean)),
)
const canAdd = computed(() => props.canAdd)
const currentType = computed(() => wizardTreatmentTypes[currentTypeIndex.value])
const currentCodes = computed(
  () => treatmentCodesByType[currentType.value?.id] || legacyTreatmentCodesByType[currentType.value?.id] || [],
)
// Computed for carousel-with-peek navigation
const prevType = computed(() => {
  const typeCount = wizardTreatmentTypes.length
  if (!typeCount) return null
  const prevIndex = (currentTypeIndex.value - 1 + typeCount) % typeCount
  return wizardTreatmentTypes[prevIndex]
})
const nextType = computed(() => {
  const typeCount = wizardTreatmentTypes.length
  if (!typeCount) return null
  const nextIndex = (currentTypeIndex.value + 1) % typeCount
  return wizardTreatmentTypes[nextIndex]
})
const selectedCodeLabels = computed(() =>
  selectedCodes.value
    .map((item) => [item?.code, item?.nameMn || item?.name].filter(Boolean).join(' '))
    .filter(Boolean),
)
const previewCodes = computed(() => selectedCodeLabels.value.slice(0, maxPreviewCodes))
const remainingCodeCount = computed(() => Math.max(0, selectedCodeLabels.value.length - maxPreviewCodes))
const surfaceTriggerLabel = computed(() =>
  selectedSurfaces.value.length ? selectedSurfaces.value.join(', ') : 'Гадаргуу сонгох',
)
const diagnosisSummary = computed(() => {
  const diagnosis = selectedDiagnosis.value
  if (!diagnosis?.code) return 'Select diagnosis'
  const name = diagnosis.name || diagnosis.nameMn || ''
  return name ? `${diagnosis.code} ${name}` : diagnosis.code
})
const selectionSummary = computed(() => {
  const surfaceText = selectedSurfaces.value.length ? selectedSurfaces.value.join(', ') : 'Surface'
  const diagnosisText = selectedDiagnosis.value?.code ? selectedDiagnosis.value.code : 'Diagnosis'
  return `${surfaceText} • ${diagnosisText}`
})
const mockDiagnoses = computed(() => diagnoses.slice(0, 6))
const filteredDiagnoses = computed(() => {
  if (!diagnosisQuery.value) return mockDiagnoses.value
  const q = diagnosisQuery.value.toLowerCase()
  return mockDiagnoses.value.filter(
    (item) => item.code.toLowerCase().includes(q) || item.name.toLowerCase().includes(q),
  )
})

watch(
  () => currentType.value?.id,
  () => {
    selectedCodes.value = []
    showTooltipCode.value = null
  },
  { immediate: true },
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

const updateSurfaceDropdownPosition = () => {
  if (!showSurfaceDropdown.value || !surfaceTriggerRef.value || typeof window === 'undefined') return
  const rect = surfaceTriggerRef.value.getBoundingClientRect()
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
  const dropdownHeight = surfaceDropdownRef.value?.offsetHeight || 0
  const spaceBelow = viewportHeight - rect.bottom - gap
  const spaceAbove = rect.top - gap
  const openUp = dropdownHeight > 0 && spaceBelow < dropdownHeight && spaceAbove > spaceBelow
  const top = openUp ? Math.max(gap, rect.top - dropdownHeight - gap) : rect.bottom + gap

  surfaceDropdownPlacement.value = openUp ? 'top' : 'bottom'
  surfaceDropdownStyles.value = {
    top: `${top}px`,
    left: `${left}px`,
    width: `${width}px`,
  }
}

const scheduleSurfaceDropdownUpdate = () => {
  if (typeof window === 'undefined') return
  if (surfaceDropdownRafId) cancelAnimationFrame(surfaceDropdownRafId)
  surfaceDropdownRafId = requestAnimationFrame(updateSurfaceDropdownPosition)
}

const addSurfaceDropdownListeners = () => {
  if (typeof window === 'undefined') return
  window.addEventListener('resize', scheduleSurfaceDropdownUpdate)
  window.addEventListener('scroll', scheduleSurfaceDropdownUpdate, true)
}

const removeSurfaceDropdownListeners = () => {
  if (typeof window === 'undefined') return
  window.removeEventListener('resize', scheduleSurfaceDropdownUpdate)
  window.removeEventListener('scroll', scheduleSurfaceDropdownUpdate, true)
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
      showSurfaceDropdown.value = false
      await nextTick()
      scheduleDropdownUpdate()
      addDropdownListeners()
    } else {
      removeDropdownListeners()
    }
  },
)
watch(
  () => showSurfaceDropdown.value,
  async (open) => {
    if (open) {
      showDiagnosisDropdown.value = false
      await nextTick()
      scheduleSurfaceDropdownUpdate()
      addSurfaceDropdownListeners()
    } else {
      removeSurfaceDropdownListeners()
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
  removeSurfaceDropdownListeners()
  if (dropdownRafId) cancelAnimationFrame(dropdownRafId)
  if (surfaceDropdownRafId) cancelAnimationFrame(surfaceDropdownRafId)
})

function toggleSurface(id) {
  if (selectedSurfaces.value.includes(id)) {
    selectedSurfaces.value = selectedSurfaces.value.filter((s) => s !== id)
  } else {
    selectedSurfaces.value = [...selectedSurfaces.value, id]
  }
}

function selectDiagnosis(item) {
  selectedDiagnosis.value = item
  diagnosisQuery.value = diagnosisSummary.value
  showDiagnosisDropdown.value = false
}

function clearDiagnosis() {
  selectedDiagnosis.value = null
  diagnosisQuery.value = ''
  showDiagnosisDropdown.value = false
}

function toggleSurfaceDropdown() {
  showSurfaceDropdown.value = !showSurfaceDropdown.value
}

function toggleDiagnosisDropdown() {
  showDiagnosisDropdown.value = !showDiagnosisDropdown.value
}

function openDiagnosisDropdown() {
  showDiagnosisDropdown.value = true
}

function handlePrevType() {
  const typeCount = wizardTreatmentTypes.length
  if (!typeCount) return
  currentTypeIndex.value = (currentTypeIndex.value - 1 + typeCount) % typeCount
}

function handleNextType() {
  const typeCount = wizardTreatmentTypes.length
  if (!typeCount) return
  currentTypeIndex.value = (currentTypeIndex.value + 1) % typeCount
}

// Category dropdown functions (UI only)
function toggleCategoryDropdown() {
  showCategoryDropdown.value = !showCategoryDropdown.value
}

function selectCategory(index) {
  currentTypeIndex.value = index
  showCategoryDropdown.value = false
}

function isCodeSelected(code) {
  return selectedCodeSet.value.has(code)
}

function toggleCode(code) {
  if (isCodeSelected(code)) {
    selectedCodes.value = selectedCodes.value.filter((item) => item.code !== code)
    return
  }
  const codeItem = currentCodes.value.find((item) => item.code === code)
  if (!codeItem) return
  selectedCodes.value = [...selectedCodes.value, codeItem]
}

function toggleTooltip(code) {
  showTooltipCode.value = showTooltipCode.value === code ? null : code
}

function isStatusActive(status) {
  return statusSelection.value === status
}

function onSelectStatus(status) {
  if (!status) return
  statusSelection.value = status
}

function handleAdd() {
  if (!canAdd.value) return
  emit('add')
}
</script>

<template>
  <section
    ref="wizardRef"
    :class="[
      'treatment-wizard',
      'card',
      'treatment-wizard--responsive',
      'treatment-wizard--single',
      'treatment-wizard--match'
    ]"
  >

    <div class="treatment-wizard__content">
      <!-- Side-by-Side Dropdowns -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="treatment-wizard__field relative">
          <button
            type="button"
            ref="surfaceTriggerRef"
            class="treatment-surface-trigger !w-full !rounded-xl !bg-slate-50/80 !border-slate-100"
            @click="toggleSurfaceDropdown"
          >
            <span class="treatment-surface-trigger__label !text-slate-600">
              {{ surfaceTriggerLabel }}
            </span>
            <svg class="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd" />
            </svg>
          </button>

          <Teleport to="body">
            <div
              v-if="showSurfaceDropdown"
              ref="surfaceDropdownRef"
              class="treatment-surface-dropdown"
              :class="surfaceDropdownPlacement === 'top' ? 'treatment-surface-dropdown--top' : 'treatment-surface-dropdown--bottom'"
              :style="surfaceDropdownStyles"
            >
              <div class="treatment-surface-dropdown__content">
                <div class="treatment-surface-grid">
                  <div></div>
                  <button type="button" class="treatment-surface-button" :class="selectedSurfaces.includes('B/F') ? 'treatment-surface-button--selected' : ''" @click="toggleSurface('B/F')">B/F</button>
                  <div></div>
                  <button type="button" class="treatment-surface-button" :class="selectedSurfaces.includes('M') ? 'treatment-surface-button--selected' : ''" @click="toggleSurface('M')">M</button>
                  <button type="button" class="treatment-surface-button" :class="selectedSurfaces.includes('O/I') ? 'treatment-surface-button--selected' : ''" @click="toggleSurface('O/I')">O/I</button>
                  <button type="button" class="treatment-surface-button" :class="selectedSurfaces.includes('D') ? 'treatment-surface-button--selected' : ''" @click="toggleSurface('D')">D</button>
                  <div></div>
                  <button type="button" class="treatment-surface-button" :class="selectedSurfaces.includes('L/P') ? 'treatment-surface-button--selected' : ''" @click="toggleSurface('L/P')">L/P</button>
                  <div></div>
                </div>
              </div>
            </div>
          </Teleport>
        </div>

        <div class="treatment-wizard__field relative">
          <div
            ref="diagnosisTriggerRef"
            class="treatment-diagnosis-trigger !w-full !rounded-xl !bg-slate-50/80 !border-slate-100"
            @click="toggleDiagnosisDropdown"
          >
            <input
              v-model="diagnosisQuery"
              type="text"
              placeholder="Онош сонгох"
              class="treatment-input w-full bg-transparent text-slate-600 focus:outline-none !text-sm"
              @focus="openDiagnosisDropdown"
            />
            <svg class="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd" />
            </svg>
          </div>

          <Teleport to="body">
            <div
              v-if="showDiagnosisDropdown"
              ref="diagnosisDropdownRef"
              class="treatment-diagnosis-dropdown"
              :class="dropdownPlacement === 'top' ? 'treatment-diagnosis-dropdown--top' : 'treatment-diagnosis-dropdown--bottom'"
              :style="dropdownStyles"
            >
              <button type="button" class="treatment-diagnosis-clear" @click.stop="clearDiagnosis">Алгасах</button>
              <div class="treatment-diagnosis-list divide-y divide-slate-100">
                <button
                  v-for="item in filteredDiagnoses"
                  :key="item.code"
                  type="button"
                  class="treatment-diagnosis-item"
                  @click.stop="selectDiagnosis(item)"
                >
                  <p class="font-semibold">{{ item.code }}</p>
                  <p class="text-xs text-slate-500">{{ item.name }}</p>
                </button>
              </div>
            </div>
          </Teleport>
        </div>
      </div>

      <div class="treatment-wizard__block treatment-wizard__block--codes min-w-0">
        <!-- Carousel-with-Peek Navigation + Dropdown -->
      <!-- Carousel -->
      <div class="treatment-carousel !justify-center gap-2 mb-6">
        <button type="button" class="treatment-carousel__arrow !w-9 !h-9 !bg-slate-50 !border-slate-100" @click="handlePrevType">
          <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.78 4.22a.75.75 0 010 1.06L8.06 10l4.72 4.72a.75.75 0 11-1.06 1.06l-5.25-5.25a.75.75 0 010-1.06l5.25-5.25a.75.75 0 011.06 0z" clip-rule="evenodd" />
          </svg>
        </button>

        <button type="button" class="treatment-carousel__item treatment-carousel__item--prev !text-[13px] opacity-40 px-2" @click="handlePrevType">
          {{ prevType?.label }}
        </button>

        <div class="treatment-carousel__active-wrapper">
          <button type="button" class="treatment-carousel__item treatment-carousel__item--active !bg-blue-50 !text-blue-600 !border-blue-200 !px-6 !py-2 !rounded-full !text-base font-bold shadow-sm" @click="toggleCategoryDropdown">
            {{ currentType?.label }}
            <svg class="w-4 h-4 ml-1.5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd" />
            </svg>
          </button>

          <div v-if="showCategoryDropdown" class="treatment-carousel__dropdown">
            <button v-for="(type, index) in wizardTreatmentTypes" :key="type.id" type="button" class="treatment-carousel__dropdown-item" :class="currentTypeIndex === index ? 'treatment-carousel__dropdown-item--active' : ''" @click="selectCategory(index)">
              <span v-if="currentTypeIndex === index" class="treatment-carousel__dropdown-check">✓</span>
              {{ type.label }}
            </button>
          </div>
        </div>

        <button type="button" class="treatment-carousel__item treatment-carousel__item--next !text-[13px] opacity-40 px-2" @click="handleNextType">
          {{ nextType?.label }}
        </button>

        <button type="button" class="treatment-carousel__arrow !w-9 !h-9 !bg-slate-50 !border-slate-100" @click="handleNextType">
          <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.22 4.22a.75.75 0 011.06 0l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 11-1.06-1.06L11.94 10 7.22 5.28a.75.75 0 010-1.06z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <!-- Code Grid (3 Columns) -->
      <div class="grid grid-cols-3 gap-3 min-w-0 mb-6 px-4">
        <div v-for="item in currentCodes" :key="item.code" class="relative group">
          <button
            type="button"
            class="treatment-code-button !w-full !rounded-xl !bg-white !border-slate-100 !px-2 !py-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:border-blue-200"
            :class="isCodeSelected(item.code) ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-100 !shadow-blue-500/5' : ''"
            @click="toggleCode(item.code)"
          >
            <span class="block text-center text-[13px] font-bold text-slate-700">{{ item.nameMn || item.name }}</span>
          </button>
          <div
            class="treatment-code-tooltip"
            :class="showTooltipCode === item.code ? 'treatment-code-tooltip--visible' : ''"
          >
            {{ item.code }}
          </div>
        </div>
      </div>
      </div>

    </div>

    <div class="treatment-action-bar !bg-white !p-4 !rounded-b-2xl !border-t-slate-50">
      <div class="flex items-center justify-between gap-4">
        <div class="treatment-status-actions-segmented !bg-slate-100 !p-1 !rounded-xl !gap-1 !flex-1 !max-w-[320px]">
          <button
            v-for="option in statusOptions"
            :key="option.id"
            type="button"
            class="flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all"
            :class="isStatusActive(option.id) ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
            @click="onSelectStatus(option.id)"
          >
            {{ option.label }}
          </button>
        </div>
        <button
          type="button"
          class="treatment-add-button-primary !flex-1 !rounded-xl !h-11 !text-sm font-bold shadow-md hover:shadow-lg transition-all"
          :disabled="!canAdd"
          @click="handleAdd"
        >
          Нэмэх
        </button>
      </div>
    </div>
  </section>
</template>
