<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import diagnoses from '@/data/diagnoses'

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
  canAdd: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:surfaces', 'update:diagnosis', 'update:code', 'add'])
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
const selectedCodeSet = computed(() =>
  new Set(selectedCodes.value.map((item) => item?.code).filter(Boolean)),
)
const canAdd = computed(() => props.canAdd)
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
  showDiagnosisDropdown.value = false
}

function clearDiagnosis() {
  selectedDiagnosis.value = null
  showDiagnosisDropdown.value = false
}

function toggleSurfaceDropdown() {
  showSurfaceDropdown.value = !showSurfaceDropdown.value
}




function prevType() {
  currentTypeIndex.value = (currentTypeIndex.value - 1 + treatmentTypes.length) % treatmentTypes.length
}

function nextType() {
  currentTypeIndex.value = (currentTypeIndex.value + 1) % treatmentTypes.length
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
      'treatment-wizard--single'
    ]"
  >
    

    <div class="treatment-wizard__content">
      <div class="treatment-wizard__block">
        <div class="space-y-3">
          <div class="relative">
            <button
              type="button"
              ref="surfaceTriggerRef"
              class="treatment-surface-trigger"
              @click="toggleSurfaceDropdown"
            >
              <span class="treatment-surface-trigger__label">
                {{ selectedSurfaces.length ? selectedSurfaces.join(', ') : 'Гадаргуу сонгох' }}
              </span>
              <svg class="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            <Teleport to="body">
              <div
                v-if="showSurfaceDropdown"
                ref="surfaceDropdownRef"
                class="treatment-surface-dropdown"
                :class="surfaceDropdownPlacement === 'top'
                  ? 'treatment-surface-dropdown--top'
                  : 'treatment-surface-dropdown--bottom'"
                :style="surfaceDropdownStyles"
              >
                <div class="treatment-surface-dropdown__content">
                  <div class="treatment-surface-grid">
                    <div></div>
                    <button
                      type="button"
                      class="treatment-surface-button"
                      :class="selectedSurfaces.includes('B/F')
                        ? 'border-blue-600 bg-blue-50 text-slate-900 ring-2 ring-blue-400 ring-offset-2 ring-offset-white'
                        : ''"
                      @click="toggleSurface('B/F')"
                    >
                      B/F
                    </button>

                    <div></div>

                    <button
                      type="button"
                      class="treatment-surface-button"
                      :class="selectedSurfaces.includes('M') ? 'bg-emerald-50 border-blue-500 text-emerald-700 ring-2 ring-blue-400 ring-offset-2 ring-offset-white' : ''"
                      @click="toggleSurface('M')"
                    >
                      M
                    </button>

                    <button
                      type="button"
                      class="treatment-surface-button"
                      :class="selectedSurfaces.includes('O/I') ? 'bg-emerald-50 border-blue-500 text-emerald-700 ring-2 ring-blue-400 ring-offset-2 ring-offset-white' : ''"
                      @click="toggleSurface('O/I')"
                    >
                      O/I
                    </button>

                    <button
                      type="button"
                      class="treatment-surface-button"
                      :class="selectedSurfaces.includes('D') ? 'bg-emerald-50 border-blue-500 text-emerald-700 ring-2 ring-blue-400 ring-offset-2 ring-offset-white' : ''"
                      @click="toggleSurface('D')"
                    >
                      D
                    </button>

                    <div></div>
                    <button
                      type="button"
                      class="treatment-surface-button"
                      :class="selectedSurfaces.includes('L/P') ? 'bg-emerald-50 border-blue-500 text-emerald-700 ring-2 ring-blue-400 ring-offset-2 ring-offset-white' : ''"
                      @click="toggleSurface('L/P')"
                    >
                      L/P
                    </button>
                    <div></div>
                  </div>
                </div>
              </div>
            </Teleport>

            <!-- <p v-if="selectedSurfaces.length" class="mt-2 text-xs text-emerald-700">
              Selected surfaces: {{ selectedSurfaces.join(', ') }}
            </p> -->
          </div>
        </div>
      </div>

      <div class="treatment-wizard__block">
        <div class="space-y-3">
          <div>
            <div class="relative">
              <div
                ref="diagnosisTriggerRef"
                class="treatment-diagnosis-trigger"
                @click="showDiagnosisDropdown = !showDiagnosisDropdown"
              >
                <input
                  v-model="diagnosisQuery"
                  type="text"
                  placeholder="Оншилгоо хайх..."
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
                {{ selectedDiagnosis.code }} A? {{ selectedDiagnosis.name }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="treatment-wizard__block treatment-wizard__block--codes min-w-0">
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

        <div
          class="treatment-code-grid grid gap-3 min-w-0 
            [grid-template-columns:repeat(auto-fit,minmax(84px, 1fr))]
            lg:gap-2 lg:[grid-template-columns:repeat(auto-fit,minmax(72px,1fr))]
            xl:gap-3 xl:[grid-template-columns:repeat(auto-fit,minmax(88px,1fr))]]
            "
              >
          <div v-for="item in currentCodes" :key="item.code" class="relative group">
            <button
              type="button"
              class="treatment-code-button"
              :class="isCodeSelected(item.code) ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-200' : ''"
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
              class="treatment-code-tooltip"
              :class="showTooltipCode === item.code ? 'treatment-code-tooltip--visible' : ''"
            >
              {{ item.nameMn }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="treatment-action-bar treatment-action-bar--inline">
      <div class="treatment-action-bar__buttons">
        <button
          type="button"
          class="treatment-action-button treatment-action-button--primary"
          :disabled="!canAdd"
          @click="handleAdd"
        >
          <span class="treatment-hit-visual">нэмэх</span>
        </button>
      </div>
    </div>
  </section>
</template>
