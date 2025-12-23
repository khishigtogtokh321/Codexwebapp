<script setup>
import { computed, ref, watch } from 'vue'
import TreatmentTypeSelector from './TreatmentTypeSelector.vue'
import { getTreatmentScope, TREATMENT_SCOPE } from '@/utils/treatmentScope'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  selectedTeeth: {
    type: Array,
    default: () => [],
  },
  selectedTreatments: {
    type: Array,
    default: () => [],
  },
  treatments: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['close', 'treatment-toggle', 'add'])

const currentStep = ref(1)
const selectedMode = ref('general')

const steps = [
  { id: 1, label: 'Горим сонгох' },
  { id: 2, label: 'Эмчилгээ сонгох' },
  { id: 3, label: 'Баталгаажуулах' },
]

const modeOptions = [
  { id: 'general', label: 'Ерөнхий үйлчилгээ', helper: 'Шүд шаардахгүй' },
  { id: 'tooth', label: 'Шүдтэй эмчилгээ', helper: 'Шүд шаардана' },
]

const hasSelectedTeeth = computed(() => props.selectedTeeth.length > 0)
const selectedTreatmentItems = computed(() =>
  props.selectedTreatments
    .map((id) => props.treatments.find((t) => t.id === id))
    .filter(Boolean),
)

const modeTreatments = computed(() => {
  if (selectedMode.value === 'general') {
    return props.treatments.filter((t) => getTreatmentScope(t) === TREATMENT_SCOPE.GENERAL)
  }
  if (selectedMode.value === 'tooth') {
    return props.treatments.filter((t) => getTreatmentScope(t) === TREATMENT_SCOPE.TOOTH)
  }
  return props.treatments
})

const requiresToothSelection = computed(() =>
  selectedTreatmentItems.value.some((treatment) => getTreatmentScope(treatment) === TREATMENT_SCOPE.TOOTH),
)

const canAdd = computed(
  () => props.selectedTreatments.length > 0 && (!requiresToothSelection.value || hasSelectedTeeth.value),
)

const toothContext = computed(() =>
  hasSelectedTeeth.value ? `Сонгосон шүд: ${props.selectedTeeth.join(', ')}` : 'Шүд сонгоогүй',
)

const selectedModeLabel = computed(() =>
  selectedMode.value === 'tooth' ? 'Шүдтэй эмчилгээ' : 'Ерөнхий үйлчилгээ',
)

const selectedTreatmentLabels = computed(() =>
  selectedTreatmentItems.value.map((treatment) => treatment.label || treatment.id).filter(Boolean),
)

const isFirstStep = computed(() => currentStep.value === 1)
const isLastStep = computed(() => currentStep.value === steps.length)

const nextDisabled = computed(() => {
  if (currentStep.value === 1) return !selectedMode.value
  if (currentStep.value === 2) return props.selectedTreatments.length === 0
  return false
})

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return
    currentStep.value = 1
    selectedMode.value = hasSelectedTeeth.value ? 'tooth' : 'general'
  },
)

watch(selectedMode, () => {
  const allowedIds = new Set(modeTreatments.value.map((t) => t.id))
  props.selectedTreatments.forEach((id) => {
    if (!allowedIds.has(id)) emit('treatment-toggle', id)
  })
})

function selectMode(modeId) {
  selectedMode.value = modeId
  if (currentStep.value === 1) {
    currentStep.value = 2
  }
}

function goNext() {
  if (nextDisabled.value) return
  if (currentStep.value < steps.length) currentStep.value += 1
}

function goBack() {
  if (currentStep.value > 1) currentStep.value -= 1
}

function handleAdd() {
  if (canAdd.value) emit('add')
}
</script>

<template>
  <transition name="fade">
    <div v-if="open" class="fixed inset-0 z-40 bg-black/20" @click="emit('close')"></div>
  </transition>

  <transition name="slide">
    <aside
      v-if="open"
      class="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
    >
      <div class="border-b border-gray-200 px-4 py-4 space-y-3">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-blue-600">Алхам {{ currentStep }} / 3</p>
            <h2 class="text-lg font-semibold text-gray-900">Эмчилгээ нэмэх</h2>
          </div>
          <button
            type="button"
            class="rounded-full border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
            @click="emit('close')"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p class="text-xs text-slate-500 text-right">{{ toothContext }}</p>

        <div class="grid grid-cols-3 gap-2">
          <div
            v-for="step in steps"
            :key="step.id"
            class="flex items-center gap-2 rounded-lg border px-2 py-2"
            :class="currentStep === step.id ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white'"
          >
            <span
              class="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold"
              :class="currentStep === step.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'"
            >
              {{ step.id }}
            </span>
            <div class="min-w-0">
              <p class="text-sm font-semibold text-gray-800 truncate">{{ step.label }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-1 p-4 space-y-4">
        <div v-if="currentStep === 1" class="space-y-3">
          <p class="text-sm text-gray-600">Горимоо сонгоно уу.</p>
          <div class="grid gap-3">
            <button
              v-for="mode in modeOptions"
              :key="mode.id"
              type="button"
              class="min-h-[56px] w-full rounded-xl border px-4 py-3 text-left bg-white text-slate-800 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25"
              :class="
                selectedMode === mode.id
                  ? 'border-2 border-blue-600 ring-2 ring-blue-600/15 shadow-none'
                  : 'border-slate-200 hover:border-slate-400 hover:shadow-sm'
              "
              @click="selectMode(mode.id)"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-sm font-semibold text-gray-900">{{ mode.label }}</p>
                  <p class="text-xs text-slate-500">{{ mode.helper }}</p>
                </div>
                <span
                  class="flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold transition-colors duration-150"
                  :class="selectedMode === mode.id ? 'border-blue-600 bg-white text-blue-600' : 'border-slate-200 bg-white text-slate-500'"
                >
                  {{ mode.id === 'general' ? 'G' : 'T' }}
                </span>
              </div>
            </button>
          </div>
        </div>

        <div v-else-if="currentStep === 2" class="space-y-2">
          <TreatmentTypeSelector
            :selected-types="selectedTreatments"
            :treatments="modeTreatments"
            @toggle="(id) => emit('treatment-toggle', id)"
          />
          <p v-if="requiresToothSelection && !hasSelectedTeeth" class="text-xs text-amber-600">
            Эхлээд шүд сонгоно уу.
          </p>
        </div>

        <div v-else class="space-y-3">
          <div class="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <p class="text-xs text-slate-500">Сонгосон горим</p>
            <p class="text-sm font-semibold text-gray-900">{{ selectedModeLabel }}</p>
          </div>

          <div class="rounded-lg border border-gray-200 bg-white p-3 space-y-2">
            <p class="text-xs text-slate-500">Эмчилгээ</p>
            <div v-if="selectedTreatmentLabels.length" class="flex flex-wrap gap-1">
              <span
                v-for="label in selectedTreatmentLabels"
                :key="label"
                class="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700"
              >
                {{ label }}
              </span>
            </div>
            <p v-else class="text-sm text-slate-500">Эмчилгээ сонгоогүй</p>
          </div>

          <div class="rounded-lg border border-gray-200 bg-white p-3 space-y-1">
            <p class="text-xs text-slate-500">Шүдний сонголт</p>
            <p class="text-sm font-semibold text-gray-900">{{ toothContext }}</p>
          </div>

          <p v-if="requiresToothSelection && !hasSelectedTeeth" class="text-xs text-amber-600">
            Эхлээд шүд сонгоно уу.
          </p>
        </div>
      </div>

      <div class="sticky bottom-0 border-t border-gray-200 bg-white px-4 py-3">
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="min-h-[44px] flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            @click="emit('close')"
          >
            Цуцлах
          </button>
          <button
            v-if="!isFirstStep"
            type="button"
            class="min-h-[44px] flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            @click="goBack"
          >
            Буцах
          </button>
          <button
            v-if="!isLastStep"
            type="button"
            :disabled="nextDisabled"
            class="min-h-[44px] flex-1 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            @click="goNext"
          >
            Дараах
          </button>
          <button
            v-else
            type="button"
            :disabled="!canAdd"
            class="min-h-[44px] flex-1 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            @click="handleAdd"
          >
            Нэмэх
          </button>
        </div>
      </div>
    </aside>
  </transition>
</template>
